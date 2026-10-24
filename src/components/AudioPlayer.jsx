import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Pause, Play, Square, Loader2, Sparkles, KeyRound, RotateCcw } from 'lucide-react';
import { synthesizeGoogleSpeech, clearAudioCache } from '../tts.js';
import { Button } from './ui/button';
import { PulseBadge } from './lightwind/pulse-badge';

export default function AudioPlayer({ text, lang, data, onOpenSettings }) {
  const [state, setState] = useState('idle'); // 'idle' | 'loading' | 'speaking' | 'paused'
  const [rate, setRate] = useState(1);
  const [message, setMessage] = useState('');
  const utterance = useRef(null);
  const audioElement = useRef(null);
  const activeEngine = useRef('none');

  const t = (english, hinglish) => (lang === 'hi' && hinglish ? hinglish : english);

  function stopAllAudio() {
    if (audioElement.current) {
      audioElement.current.pause();
      audioElement.current.currentTime = 0;
      audioElement.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    activeEngine.current = 'none';
  }

  useEffect(() => {
    stopAllAudio();
    setState('idle');
    setMessage('');
    return () => stopAllAudio();
  }, [text, lang]);

  function speakBrowser() {
    if (!('speechSynthesis' in window)) {
      setMessage(t('Audio is not supported in this browser. Try Chrome or Edge.', 'Is browser mein audio supported nahi. Chrome ya Edge try karein.'));
      setState('idle');
      return;
    }
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text.replace(/\*\*|`/g, ''));
    utterance.current = speech;
    speech.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    speech.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === speech.lang) || voices.find(v => v.lang.startsWith(lang === 'hi' ? 'hi' : 'en'));
    if (voice) speech.voice = voice;
    speech.onend = () => {
      setState('idle');
      activeEngine.current = 'none';
    };
    speech.onerror = (e) => {
      setState('idle');
      activeEngine.current = 'none';
      if (!['interrupted', 'canceled'].includes(e.error)) {
        setMessage(t('Audio could not play. Check device voices and try again.', 'Audio nahi chala. Device voices check karein.'));
      }
    };
    activeEngine.current = 'browser';
    setState('speaking');
    window.speechSynthesis.speak(speech);
  }

  async function speak() {
    if (state === 'speaking') {
      if (activeEngine.current === 'google' && audioElement.current) {
        audioElement.current.pause();
      } else {
        window.speechSynthesis?.pause();
      }
      setState('paused');
      return;
    }
    if (state === 'paused') {
      if (activeEngine.current === 'google' && audioElement.current) {
        audioElement.current.play();
      } else {
        window.speechSynthesis?.resume();
      }
      setState('speaking');
      return;
    }

    stopAllAudio();
    setMessage('');

    const apiKey = data?.googleTtsApiKey?.trim();
    if (apiKey) {
      setState('loading');
      try {
        const { audioUrl } = await synthesizeGoogleSpeech({
          text,
          lang,
          apiKey,
          voiceName: data.ttsVoiceName || 'Kore',
          model: data.ttsModel || 'gemini-3.8-flash',
          rate,
        });
        const audio = new Audio(audioUrl);
        audio.playbackRate = rate;
        audio.onended = () => {
          setState('idle');
          activeEngine.current = 'none';
        };
        audio.onerror = () => {
          setState('idle');
          activeEngine.current = 'none';
          setMessage(t('Audio playback error. Using device voice fallback.', 'Audio playback error. Device voice use kar rahe hain.'));
          speakBrowser();
        };
        audioElement.current = audio;
        activeEngine.current = 'google';
        await audio.play();
        setState('speaking');
      } catch (err) {
        let reason = err.message || t('Google AI Studio unreachable.', 'Google AI Studio unreachable.');
        if (err.status === 400 || err.status === 403) {
          reason = t('Google AI Studio key error: please check your Gemini API key.', 'Google AI Studio key error: kripya Gemini API key check karein.');
        } else if (err.status === 503 || /high demand|unavailable/i.test(err.message)) {
          reason = t('Gemini TTS is experiencing high demand.', 'Gemini TTS par abhi high demand hai.');
        }
        setMessage(`${reason} ${t('Falling back to device voice.', 'Device voice use ho rahi hai.')}`);
        speakBrowser();
      }
    } else {
      speakBrowser();
    }
  }

  function handleStop() {
    stopAllAudio();
    setState('idle');
  }

  function handleRateChange(newRate) {
    setRate(newRate);
    if (activeEngine.current === 'google' && audioElement.current) {
      audioElement.current.playbackRate = newRate;
    } else if (activeEngine.current === 'browser') {
      window.speechSynthesis?.cancel();
      setState('idle');
    }
  }

  async function handleClearCache() {
    stopAllAudio();
    await clearAudioCache();
    setMessage(t('✓ Audio cache cleared.', '✓ Audio cache saaf ho gaya.'));
    setTimeout(() => {
      setMessage('');
    }, 2000);
  }

  const isGoogleActive = Boolean(data?.googleTtsApiKey?.trim());

  return (
    <div className="rounded-xl border border-border/80 bg-secondary/30 p-3 mb-4 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={speak}
          disabled={state === 'loading'}
          size="sm"
          className="gap-1.5 h-8 text-xs font-semibold"
          aria-label={state === 'speaking' ? 'Pause audio' : state === 'paused' ? 'Resume audio' : 'Listen to explanation'}
        >
          {state === 'loading' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : state === 'speaking' ? (
            <Pause className="h-3.5 w-3.5 fill-current" />
          ) : state === 'paused' ? (
            <Play className="h-3.5 w-3.5 fill-current" />
          ) : (
            <Volume2 className="h-3.5 w-3.5" />
          )}
          <span>
            {state === 'loading'
              ? t('Synthesizing…', 'Taiyaar ho raha hai…')
              : state === 'speaking'
              ? t('Pause', 'Pause')
              : state === 'paused'
              ? t('Resume', 'Phir chalao')
              : t('Listen', 'Suno')}
          </span>
        </Button>

        {state !== 'idle' && (
          <Button
            variant="outline"
            size="iconSm"
            onClick={handleStop}
            aria-label="Stop audio"
            title="Stop audio"
          >
            <Square className="h-3 w-3 fill-current" />
          </Button>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground ml-1">
          <label htmlFor="audio-rate" className="sr-only">Playback speed</label>
          <select
            id="audio-rate"
            value={rate}
            onChange={e => handleRateChange(Number(e.target.value))}
            className="rounded border border-input bg-card px-2 py-1 text-[11px] text-foreground cursor-pointer"
          >
            {[0.75, 1, 1.25, 1.5].map(n => (
              <option key={n} value={n}>{n}×</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleClearCache}
          className="inline-flex items-center gap-1 rounded border border-border/70 bg-card/60 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          title={t('Clear stored audio cache (re-fetch fresh audio next time)', 'Cached audio clear karein')}
          aria-label="Clear audio cache"
        >
          <RotateCcw className="h-2.5 w-2.5" />
          <span className="hidden sm:inline">{t('Clear Cache', 'Clear Cache')}</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ml-auto ${
            isGoogleActive
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20'
              : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
          title={isGoogleActive ? 'Gemini Voice active. Click to customize voice.' : 'Add free Gemini API key for natural human voice'}
        >
          {isGoogleActive ? (
            <Sparkles className="h-3 w-3 fill-current text-primary" />
          ) : (
            <KeyRound className="h-3 w-3" />
          )}
          <span>{isGoogleActive ? 'Gemini Voice' : 'Free Gemini TTS'}</span>
        </button>
      </div>

      {message && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium leading-relaxed">
          {message}
        </p>
      )}
    </div>
  );
}
