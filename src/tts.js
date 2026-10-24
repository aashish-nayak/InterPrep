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

const DB_NAME = 'interprep_audio_v2';
const STORE_NAME = 'audio_cache';

let dbPromise = null;

function getAudioDB() {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
  return dbPromise;
}

export async function getCachedAudioBlob(cacheKey) {
  try {
    const db = await getAudioDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(cacheKey);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  } catch {
    return null;
  }
}

export async function storeAudioBlob(cacheKey, blob) {
  try {
    const db = await getAudioDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(blob, cacheKey);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}

export async function getAudioCacheStats() {
  try {
    const db = await getAudioDB();
    if (!db) return { count: 0 };
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.count();
        req.onsuccess = () => resolve({ count: req.result || 0 });
        req.onerror = () => resolve({ count: 0 });
      } catch {
        resolve({ count: 0 });
      }
    });
  } catch {
    return { count: 0 };
  }
}

export async function clearAudioCache() {
  for (const url of audioCache.values()) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }
  audioCache.clear();

  try {
    const db = await getAudioDB();
    if (!db) return true;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}

export const GEMINI_TTS_MODELS = [
  { id: 'gemini-3.8-flash-tts', name: 'Gemini 3.8 Flash TTS (High Fidelity · Recommended)', tier: 'flagship' },
  { id: 'gemini-3.8-flash-lite-tts', name: 'Gemini 3.8 Flash-Lite TTS (Fast & High Availability)', tier: 'lite' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Stable Fallback)', tier: 'legacy' }
];

export function normalizeTtsModel(rawModel) {
  if (!rawModel || rawModel === 'gemini-3.8-flash') {
    return 'gemini-3.8-flash-tts';
  }
  return rawModel;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function synthesizeGoogleSpeech({
  text,
  lang = 'en',
  apiKey,
  voiceName,
  gender = 'FEMALE',
  model = 'gemini-3.8-flash-tts',
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
  const normalizedRequestedModel = normalizeTtsModel(model);

  // Cache key includes model, voice name, rate, and cleaned text
  const cacheKey = `${normalizedRequestedModel}:${voice.voiceName}:${speakingRate}:${cleaned}`;

  // 1. Check fast in-memory cache
  if (audioCache.has(cacheKey)) {
    return { audioUrl: audioCache.get(cacheKey), cached: true, source: 'memory' };
  }

  // 2. Check persistent user-side IndexedDB cache
  const storedBlob = await getCachedAudioBlob(cacheKey);
  if (storedBlob) {
    const cachedUrl = URL.createObjectURL(storedBlob);
    audioCache.set(cacheKey, cachedUrl);
    return { audioUrl: cachedUrl, cached: true, source: 'indexeddb' };
  }

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: cleaned }]
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

  // Build prioritized candidate models list with high-availability fallbacks
  const candidateModels = Array.from(new Set([
    normalizedRequestedModel,
    'gemini-3.8-flash-lite-tts',
    'gemini-3.8-flash-tts',
    'gemini-2.0-flash'
  ]));

  let lastStatus = null;
  let lastErrorMessage = '';
  let successfulModel = null;
  let successfulResponseData = null;

  for (let i = 0; i < candidateModels.length; i++) {
    const candidate = candidateModels[i];
    let response = null;

    // Up to 2 attempts per candidate if encountering 503 high demand spike
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        response = await requestModel(candidate);
      } catch (networkErr) {
        lastErrorMessage = networkErr?.message || 'Network error reaching Google AI Studio';
        break;
      }

      if (response && response.ok) {
        break;
      }

      lastStatus = response?.status;

      // Handle auth / permission issues early
      if (response && (response.status === 400 || response.status === 401 || response.status === 403)) {
        let errBody = null;
        try {
          errBody = await response.json();
        } catch {
          // ignore json parse error
        }
        const msg = errBody?.error?.message || '';

        // If 400 is due to unsupported audio modality on a model, allow fallback to next candidate
        if (response.status === 400 && /modality|audio|support|not found/i.test(msg)) {
          lastErrorMessage = msg;
          break;
        }

        // If key is invalid or quota blocked permanently, fail fast
        if (response.status === 401 || response.status === 403 || /API_KEY_INVALID|unregistered|permission/i.test(msg)) {
          const keyErr = new Error(msg || 'Invalid or unauthorized Google AI Studio API key.');
          keyErr.status = response.status;
          throw keyErr;
        }
      }

      // If 503 (high demand spike) on first attempt, back off briefly and retry once before cascading
      if (response && response.status === 503 && attempt === 1) {
        await delay(600);
        continue;
      }

      // Extract error message for reporting if all candidates fail
      try {
        const errorJson = await response.json();
        if (errorJson?.error?.message) {
          lastErrorMessage = errorJson.error.message;
        }
      } catch {
        lastErrorMessage = `Google AI Studio request failed with status ${response?.status}`;
      }
      break;
    }

    if (response && response.ok) {
      try {
        const data = await response.json();
        const candidatePart = data.candidates?.[0]?.content?.parts?.[0];
        if (candidatePart?.inlineData?.data) {
          successfulModel = candidate;
          successfulResponseData = data;
          break;
        }
      } catch (parseErr) {
        lastErrorMessage = parseErr?.message || 'Failed parsing Google audio response';
      }
    }
  }

  if (!successfulResponseData) {
    const finalErr = new Error(
      lastErrorMessage ||
      'Gemini TTS models are currently experiencing high demand. Please try again shortly or use device audio fallback.'
    );
    finalErr.status = lastStatus || 503;
    throw finalErr;
  }

  const candidate = successfulResponseData.candidates?.[0];
  const part = candidate?.content?.parts?.[0];
  const inlineData = part?.inlineData;

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

  // Persist into user-side IndexedDB for instant, cost-free future replays
  storeAudioBlob(cacheKey, blob).catch(() => {});

  // Maintain in-memory cache size
  if (audioCache.size >= 40) {
    const oldestKey = audioCache.keys().next().value;
    const oldUrl = audioCache.get(oldestKey);
    if (oldUrl) URL.revokeObjectURL(oldUrl);
    audioCache.delete(oldestKey);
  }
  audioCache.set(cacheKey, audioUrl);

  return { audioUrl, cached: false, model: successfulModel };
}

export async function testGoogleTtsKey(apiKey, lang = 'en', voiceName = 'Kore', model = 'gemini-3.8-flash-tts') {
  const testText = lang === 'hi' 
    ? 'इंटरप्रेप जेमिनी ऑडियो तैयार है।' 
    : 'InterPrep Google AI Studio audio is ready.';
  return synthesizeGoogleSpeech({
    text: testText,
    lang,
    apiKey,
    voiceName,
    model,
    rate: 1.0
  });
}
