import React, { useState, useEffect, useRef } from 'react';
import { KeyRound, Sparkles, Volume2, Check, Loader2, Eye, EyeOff, ExternalLink, Trash2, X } from 'lucide-react';
import { testGoogleTtsKey, GEMINI_VOICES, GEMINI_TTS_MODELS, normalizeTtsModel, getAudioCacheStats, clearAudioCache } from './tts.js';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { PulseBadge } from './components/lightwind/pulse-badge';

export default function VoiceSettingsModal({ isOpen, onClose, data, onSave, currentLang = 'en' }) {
  const [apiKey, setApiKey] = useState(data.googleTtsApiKey || '');
  const [voiceName, setVoiceName] = useState(data.ttsVoiceName || 'Kore');
  const [model, setModel] = useState(normalizeTtsModel(data.ttsModel));
  const [showKey, setShowKey] = useState(false);
  const [testState, setTestState] = useState('idle'); // 'idle' | 'testing' | 'success' | 'error'
  const [testMsg, setTestMsg] = useState('');
  const [cachedCount, setCachedCount] = useState(0);
  const testAudioRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(data.googleTtsApiKey || '');
      setVoiceName(data.ttsVoiceName || 'Kore');
      setModel(normalizeTtsModel(data.ttsModel));
      setTestState('idle');
      setTestMsg('');
      getAudioCacheStats().then(s => setCachedCount(s.count || 0)).catch(() => {});
    } else {
      if (testAudioRef.current) {
        testAudioRef.current.pause();
        testAudioRef.current = null;
      }
    }
  }, [isOpen, data]);

  async function handleTest() {
    const keyToTest = apiKey.trim();
    if (!keyToTest) {
      setTestState('error');
      setTestMsg('Please enter an API key first.');
      return;
    }
    setTestState('testing');
    setTestMsg('Synthesizing sample voice with Google AI Studio...');
    try {
      const { audioUrl } = await testGoogleTtsKey(keyToTest, currentLang, voiceName, model);
      if (testAudioRef.current) {
        testAudioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      testAudioRef.current = audio;
      audio.onended = () => setTestState('success');
      audio.onerror = () => {
        setTestState('error');
        setTestMsg('Sample audio could not play in browser.');
      };
      await audio.play();
      setTestState('success');
      setTestMsg(currentLang === 'hi' ? '✓ Google AI Studio ऑडियो तैयार है!' : '✓ Google AI Studio voice verified successfully!');
    } catch (err) {
      setTestState('error');
      const msg = err.status === 400 || err.status === 403
        ? 'Invalid API key or Generative Language API is not enabled for your AI Studio key.'
        : (err.message || 'Failed to connect to Google AI Studio.');
      setTestMsg(msg);
    }
  }

  function handleSave(e) {
    e?.preventDefault();
    onSave({
      googleTtsApiKey: apiKey.trim(),
      ttsVoiceName: voiceName,
      ttsModel: normalizeTtsModel(model)
    });
    onClose();
  }

  function handleClearKey() {
    setApiKey('');
    setTestState('idle');
    setTestMsg('');
    onSave({
      googleTtsApiKey: '',
      ttsVoiceName: voiceName,
      ttsModel: normalizeTtsModel(model)
    });
  }

  const isConfigured = Boolean(apiKey.trim());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Google AI Studio (Gemini) TTS</h3>
            <p className="text-xs text-muted-foreground">Natural human Hindi and English voice generation</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="py-4 space-y-4">
        {/* Status banner */}
        <div className={`flex items-start gap-3 rounded-lg border p-3.5 text-xs ${
          isConfigured 
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300' 
            : 'border-border bg-secondary/50 text-muted-foreground'
        }`}>
          <PulseBadge
            variant={isConfigured ? 'emerald' : 'secondary'}
            pulse={isConfigured}
            className="shrink-0"
          >
            {isConfigured ? 'Gemini Voice Active' : 'Browser Fallback'}
          </PulseBadge>
          <div className="text-xs leading-relaxed">
            {isConfigured
              ? 'AI Studio text-to-speech enabled for Hindi & English explanations.'
              : 'Add your free Google AI Studio (Gemini) API key below for natural voice.'}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="google-api-key" className="text-xs font-semibold text-foreground">
                Google AI Studio API Key
              </label>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                Stored in localStorage only
              </span>
            </div>
            <div className="relative flex items-center">
              <Input
                id="google-api-key"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (testState !== 'idle') setTestState('idle');
                }}
                placeholder="AIzaSy..."
                autoComplete="off"
                spellCheck="false"
                className="pr-10 font-mono text-xs"
              />
              <button
                type="button"
                className="absolute right-2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="tts-voice-name" className="text-xs font-semibold text-foreground">
                Voice Persona
              </label>
              <select
                id="tts-voice-name"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-xs text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {GEMINI_VOICES.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="tts-model" className="text-xs font-semibold text-foreground">
                Gemini Model
              </label>
              <select
                id="tts-model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-xs text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {GEMINI_TTS_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Test area */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTest}
              disabled={testState === 'testing' || !apiKey.trim()}
              className="text-xs gap-1.5"
            >
              {testState === 'testing' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" />
              )}
              Test Voice Sample
            </Button>
            {testMsg && (
              <span className={`text-xs ${testState === 'error' ? 'text-destructive font-medium' : testState === 'success' ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}`}>
                {testMsg}
              </span>
            )}
          </div>

          {/* Offline Cache section */}
          <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/20 px-3 py-2 text-xs">
            <span className="text-muted-foreground">
              Offline Audio Cache:{' '}
              <strong className="text-foreground">
                {cachedCount > 0 ? `${cachedCount} audio ${cachedCount === 1 ? 'answer' : 'answers'} stored` : '0 answers (empty)'}
              </strong>
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={cachedCount === 0}
              onClick={async () => {
                await clearAudioCache();
                setCachedCount(0);
              }}
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-destructive cursor-pointer disabled:opacity-50"
            >
              Clear Cache
            </Button>
          </div>

          {/* Guide card */}
          <div className="rounded-lg border border-border/80 bg-muted/40 p-3 text-xs space-y-2">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-primary" />
              How to get your free Google AI Studio Key (1 minute):
            </div>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-[11px] leading-relaxed">
              <li>
                Open{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  Google AI Studio API Keys <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>Click <strong>Create API Key</strong></li>
              <li>Copy and paste your key into the field above.</li>
              <li>Enjoy free, human-like voice narration for Hindi and English!</li>
            </ol>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            {isConfigured ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearKey}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear Key
              </Button>
            ) : <div />}
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gap-1.5">
                <Check className="h-3.5 w-3.5" /> Save & Apply
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
