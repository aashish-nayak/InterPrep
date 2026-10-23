// Google AI Studio (Gemini API) Text-to-Speech Integration
// Reference: https://aistudio.google.com/docs#javascript

const audioCache = new Map();

export const GEMINI_VOICES = [
  { id: 'Kore', name: 'Kore (Female · Clear & Natural)', gender: 'FEMALE' },
  { id: 'Aoede', name: 'Aoede (Female · Warm & Expressive)', gender: 'FEMALE' },
  { id: 'Puck', name: 'Puck (Male · Friendly & Upbeat)', gender: 'MALE' },
  { id: 'Charon', name: 'Charon (Male · Deep & Calm)', gender: 'MALE' },
  { id: 'Fenrir', name: 'Fenrir (Male · Strong & Resonant)', gender: 'MALE' }
];

export function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, '') // remove large code fences
    .replace(/`([^`]+)`/g, '$1')     // strip backticks around code terms
    .replace(/\*\*([^*]+)\*\*/g, '$1') // strip bold markdown
    .replace(/\*([^*]+)\*/g, '$1')   // strip italic markdown
    .replace(/#[#\s]+/g, '')         // strip headings
    .replace(/^\s*[-*•]\s+/gm, '')   // strip bullet points
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // clean links
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getVoiceConfig({ lang = 'en', voiceName, gender = 'FEMALE' } = {}) {
  const languageCode = lang === 'hi' ? 'hi-IN' : 'en-IN';
  let chosenVoice = voiceName;
  if (!chosenVoice || !GEMINI_VOICES.some(v => v.id === chosenVoice)) {
    chosenVoice = gender === 'MALE' ? 'Puck' : 'Kore';
  }
  return {
    languageCode,
    voiceName: chosenVoice,
    gender: gender === 'MALE' ? 'MALE' : 'FEMALE'
  };
}

/**
 * Wraps raw PCM audio bytes (16-bit little-endian) into a standard RIFF/WAVE container
 */
function pcmToWavBlob(pcmBytes, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
  // Check if bytes already start with 'RIFF' header
  if (
    pcmBytes.length >= 12 &&
    pcmBytes[0] === 0x52 && // R
    pcmBytes[1] === 0x49 && // I
    pcmBytes[2] === 0x46 && // F
    pcmBytes[3] === 0x46    // F
  ) {
    return new Blob([pcmBytes], { type: 'audio/wav' });
  }

  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmBytes.length;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // RIFF chunk descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  // fmt sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);           // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);            // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);  // NumChannels
  view.setUint32(24, sampleRate, true);   // SampleRate
  view.setUint32(28, byteRate, true);     // ByteRate
  view.setUint16(32, blockAlign, true);   // BlockAlign
  view.setUint16(34, bitsPerSample, true);// BitsPerSample

  // data sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const wavBytes = new Uint8Array(buffer);
  wavBytes.set(pcmBytes, 44);

  return new Blob([wavBytes], { type: 'audio/wav' });
}

export async function synthesizeGoogleSpeech({
  text,
  lang = 'en',
  apiKey,
  voiceName,
  gender = 'FEMALE',
  model = 'gemini-3.8-flash',
  rate = 1.0
}) {
  const key = (apiKey || '').trim();
  if (!key) {
    const error = new Error('GEMINI_API_KEY_REQUIRED');
    error.code = 'NO_API_KEY';
    throw error;
  }

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    const error = new Error('NO_TEXT_TO_SPEAK');
    error.code = 'EMPTY_TEXT';
    throw error;
  }

  const voice = getVoiceConfig({ lang, voiceName, gender });
  const speakingRate = Math.min(Math.max(Number(rate) || 1.0, 0.5), 2.0);

  // Cache key includes model, voice name, rate, and cleaned text
  const cacheKey = `${model}:${voice.voiceName}:${speakingRate}:${cleaned}`;
  if (audioCache.has(cacheKey)) {
    return { audioUrl: audioCache.get(cacheKey), cached: true };
  }

  const promptText = lang === 'hi'
    ? `कृपया नीचे दिए गए टेक्स्ट को स्पष्ट, स्वाभाविक और स्वाभाविक गति में बोलें। कोई अतिरिक्त अभिवादन, भूमिका या टिप्पणी न जोड़ें, केवल दिया गया टेक्स्ट ही बोलें:\n\n${cleaned}`
    : `Please read aloud the following text exactly as written with natural human intonation. Do not add any greeting, preface, or conversational comments, speak only this exact text:\n\n${cleaned}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: promptText }]
      }
    ],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: voice.voiceName
          }
        }
      }
    }
  };

  async function requestModel(targetModel) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(targetModel)}:generateContent?key=${encodeURIComponent(key)}`;
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  let response = await requestModel(model);

  // If specified model is not found, fallback to gemini-2.0-flash
  if (response.status === 404 && model !== 'gemini-2.0-flash') {
    response = await requestModel('gemini-2.0-flash');
  }

  if (!response.ok) {
    let message = `Google AI Studio request failed with status ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson?.error?.message) {
        message = errorJson.error.message;
      }
    } catch {
      // fallback
    }
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const part = candidate?.content?.parts?.[0];
  const inlineData = part?.inlineData;

  if (!inlineData?.data) {
    throw new Error('Google AI Studio returned no audio data. Please ensure the model supports audio modality.');
  }

  // Convert base64 to byte array
  const binaryString = atob(inlineData.data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Parse mimeType sample rate if specified (e.g. "audio/pcm;rate=24000")
  let sampleRate = 24000;
  const mimeType = inlineData.mimeType || 'audio/wav';
  const rateMatch = mimeType.match(/rate=(\d+)/i);
  if (rateMatch) {
    sampleRate = parseInt(rateMatch[1], 10);
  }

  let blob;
  if (mimeType.includes('mp3')) {
    blob = new Blob([bytes], { type: 'audio/mp3' });
  } else {
    // Standardize to playable WAV
    blob = pcmToWavBlob(bytes, sampleRate, 1, 16);
  }

  const audioUrl = URL.createObjectURL(blob);

  // Maintain cache size
  if (audioCache.size >= 40) {
    const oldestKey = audioCache.keys().next().value;
    const oldUrl = audioCache.get(oldestKey);
    if (oldUrl) URL.revokeObjectURL(oldUrl);
    audioCache.delete(oldestKey);
  }
  audioCache.set(cacheKey, audioUrl);

  return { audioUrl, cached: false };
}

export async function testGoogleTtsKey(apiKey, lang = 'en', voiceName = 'Kore') {
  const testText = lang === 'hi' 
    ? 'इंटरप्रेप जेमिनी ऑडियो तैयार है।' 
    : 'InterPrep Google AI Studio audio is ready.';
  return synthesizeGoogleSpeech({
    text: testText,
    lang,
    apiKey,
    voiceName,
    rate: 1.0
  });
}
