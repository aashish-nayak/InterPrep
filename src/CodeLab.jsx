import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Code2, Terminal, Square, Pencil, Check, Braces, Sparkles, Cpu, Volume2, VolumeX } from 'lucide-react';
import { traceIds, explainStep } from './trace.js';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { PulseBadge } from './components/lightwind/pulse-badge';
import { cn } from './lib/utils';
import { formatPhpCode } from './lib/formatter';
import { playExecutionSound, classifyFrameEvent } from './lib/soundFx';

function Syntax({ line }) {
  if (!line) return <span>&nbsp;</span>;
  return line.split(/(\/\/.*$|'[^']*'|"[^"\n]*"|\$[a-zA-Z_]\w*|\b(?:for|foreach|if|else|echo|true|false|null|as|intdiv|chr|var_dump|print_r|unset)\b|\b\d+\b)/g).map((part, i) => {
    const kind = part.startsWith('//') ? 'comment' : part.startsWith('$') ? 'variable' : /^['"]/.test(part) ? 'string' : /^\d+$/.test(part) ? 'number' : /^(for|foreach|if|else|echo|true|false|null|as|intdiv|chr|var_dump|print_r|unset)$/.test(part) ? 'keyword' : '';
    return <span className={kind ? `syntax-${kind}` : undefined} key={i}>{part}</span>;
  });
}

const showValue = value => typeof value === 'string' ? JSON.stringify(value) : JSON.stringify(value);

export default function CodeLab({ questions, initialId = 112, lang = 'en', compact = false, onSelectQuestion }) {
  const available = questions.filter(q => q.code.some(c => c.language === 'php') && !['laravel', 'scenarios', 'sql'].includes(q.category));
  const [id, setId] = useState(available.some(q => q.id === initialId) ? initialId : 112);
  const question = available.find(q => q.id === id) || available[0];
  const original = formatPhpCode(question.code.filter(c => c.language === 'php').map(c => c.text).join('\n\n'));
  const [code, setCode] = useState(original);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [state, setState] = useState('idle');
  const [frames, setFrames] = useState([]);
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [editing, setEditing] = useState(false);
  const [inspectorTab, setInspectorTab] = useState('variables'); // 'variables' | 'output' on mobile
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const stored = localStorage.getItem('interprep_codelab_sound');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('interprep_codelab_sound', String(next));
      } catch {}
      return next;
    });
  };
  const worker = useRef(null);
  const deadline = useRef(null);
  const sourcePanel = useRef(null);
  const busy = state === 'loading' || state === 'running';
  const traceable = traceIds.has(id) && code === original;
  const frame = frames[step];
  const previous = frames[step - 1];

  const cleanup = () => {
    worker.current?.terminate();
    worker.current = null;
    clearTimeout(deadline.current);
  };

  useEffect(() => () => cleanup(), []);

  useEffect(() => {
    if (initialId && available.some(q => q.id === initialId)) {
      setId(initialId);
    }
  }, [initialId]);

  useEffect(() => {
    cleanup();
    setCode(original);
    setOutput('');
    setError('');
    setState('idle');
    setFrames([]);
    setStep(-1);
    setPlaying(false);
    setEditing(false);
  }, [id]);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (step >= frames.length - 1) setPlaying(false);
      else setStep(value => value + 1);
    }, 1000 / speed);
    return () => clearTimeout(timer);
  }, [playing, step, frames.length, speed]);

  useEffect(() => {
    const panel = sourcePanel.current;
    const active = panel?.querySelector('[data-active="true"]');
    if (panel && active) {
      const top = active.offsetTop - panel.offsetTop;
      if (top < panel.scrollTop || top + active.offsetHeight > panel.scrollTop + panel.clientHeight) {
        panel.scrollTop = Math.max(0, top - panel.clientHeight / 2);
      }
    }
  }, [step]);

  // Audio SFX on line execution with event differentiation
  useEffect(() => {
    if (!soundEnabled || step < 0 || !frames[step]) return;
    const curFrame = frames[step];
    const prevFrame = step > 0 ? frames[step - 1] : null;
    const event = classifyFrameEvent(curFrame, code, prevFrame, step, frames.length);
    if (typeof event === 'string') {
      playExecutionSound(event);
    } else if (event && event.type) {
      playExecutionSound(event.type, event);
    }
  }, [step, soundEnabled]);

  // Audio SFX on execution error
  useEffect(() => {
    if (state === 'error' && soundEnabled) {
      playExecutionSound('error');
    }
  }, [state, soundEnabled]);

  function run() {
    cleanup();
    setState('loading');
    setOutput('');
    setError('');
    setFrames([]);
    setStep(-1);
    setPlaying(false);
    setEditing(false);
    const instance = new Worker(new URL('./php-worker.js', import.meta.url), { type: 'module' });
    worker.current = instance;
    deadline.current = setTimeout(() => {
      cleanup();
      setState('error');
      setError('Execution stopped after 20 seconds. Check for an infinite loop, or retry if the runtime was still loading.');
    }, 20000);
    instance.onmessage = ({ data }) => {
      if (worker.current !== instance) return;
      if (data.type === 'running') {
        setState('running');
        return;
      }
      setOutput(data.output || '');
      setError(data.error || '');
      setState(data.type === 'error' ? 'error' : 'done');
      if (data.steps?.length) {
        setFrames(data.steps);
        setStep(0);
        setPlaying(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      }
      cleanup();
    };
    instance.onerror = () => {
      if (worker.current !== instance) return;
      cleanup();
      setState('error');
      setError('The PHP runtime could not load. Reload the page and try again.');
    };
    instance.postMessage({ code, trace: traceable });
  }

  function reset() {
    cleanup();
    setCode(original);
    setFrames([]);
    setOutput('');
    setError('');
    setState('idle');
    setStep(-1);
    setPlaying(false);
    setEditing(false);
  }

  function play() {
    if (step === frames.length - 1) setStep(0);
    setPlaying(!playing);
  }

  function handleSelectExample(newId) {
    setId(newId);
    if (onSelectQuestion) onSelectQuestion(newId);
  }

  const explanation = explainStep(frame, code, lang);

  return (
    <section className="space-y-6">
      {!compact && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                <span>InterPrep</span>
                <span>/</span>
                <span className="text-primary font-semibold">Code Lab</span>
                <span>/</span>
                <PulseBadge variant="emerald" pulse={busy}>
                  <Cpu className="h-3 w-3" />
                  PHP 8.3 WebAssembly
                </PulseBadge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                See the code. Understand the flow.
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-2xl">
                Watch PHP execute one line at a time with variables and output right beside it in your browser.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              <label className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                Choose challenge:
              </label>
              <select
                value={id}
                onChange={e => handleSelectExample(Number(e.target.value))}
                className="w-full sm:w-auto min-h-[44px] sm:min-h-0 rounded-lg border border-hairline bg-card px-3 py-2 sm:py-1.5 text-xs text-foreground shadow-2xs focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                {available.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.id}. {item.title[lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
            <h2 className="text-base font-semibold text-foreground">
              {question.title[lang]}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {question.answer[lang].replace(/\*\*|`/g, '')}
            </p>
          </div>
        </div>
      )}

      {/* Main Execution Stage */}
      <div className="rounded-2xl border border-hairline bg-surface-2 p-2 sm:p-3 shadow-raised">
        {/* Stage Toolbar */}
        <div className="flex items-center justify-between px-1 sm:px-2 pb-2.5 pt-0.5 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="hidden sm:flex items-center gap-1.5 shrink-0" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-pink/70 transition-transform hover:scale-110" />
              <span className="h-2.5 w-2.5 rounded-full bg-sun transition-transform hover:scale-110" />
              <span className="h-2.5 w-2.5 rounded-full bg-teal/70 transition-transform hover:scale-110" />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2 sm:px-2.5 py-0.5 font-mono text-[11px] font-medium text-ink-mute shadow-2xs truncate">
              <Code2 className="h-3 w-3 text-pink shrink-0" />
              <span className="truncate">example.php</span>
              <span className="hidden sm:inline text-[10px] text-ink-mute/60 shrink-0">• PHP 8.3 WASM</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => {
                const formatted = formatPhpCode(code);
                setCode(formatted);
                setFrames([]);
                setStep(-1);
                setOutput('');
                setError('');
                setState('idle');
              }}
              disabled={busy}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border border-hairline bg-surface px-2 sm:px-2.5 py-1 text-xs font-semibold text-ink-soft hover:bg-surface-2 hover:text-ink transition-colors cursor-pointer disabled:opacity-50 shadow-2xs min-h-[36px]"
              title="Auto-format indentation (4 spaces per nested block)"
            >
              <Sparkles className="h-3.5 w-3.5 text-pink shrink-0" />
              <span className="hidden xs:inline">Format</span>
              <span className="hidden sm:inline">Code</span>
            </button>

            <button
              onClick={() => { setPlaying(false); setEditing(!editing); }}
              disabled={busy}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border border-hairline bg-surface px-2 sm:px-2.5 py-1 text-xs font-semibold text-ink-soft hover:bg-surface-2 hover:text-ink transition-colors cursor-pointer disabled:opacity-50 shadow-2xs min-h-[36px]"
            >
              {editing ? <Check className="h-3.5 w-3.5 text-teal shrink-0" /> : <Pencil className="h-3.5 w-3.5 text-ink-mute shrink-0" />}
              <span>{editing ? 'View' : 'Edit'}</span>
            </button>
          </div>
        </div>

        {/* Editor + State / Terminal Panels */}
        <div className="rounded-xl border border-hairline bg-surface overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-hairline">
          {/* Source Code Panel */}
          <div className="flex flex-col min-w-0 bg-surface">
            {editing ? (
              <textarea
                id={`code-${id}`}
                className="w-full h-[380px] p-4 font-mono text-xs leading-relaxed bg-[hsl(var(--code-bg))] text-foreground outline-none resize-none whitespace-pre"
                style={{ tabSize: 4 }}
                spellCheck="false"
                value={code}
                onKeyDown={event => {
                  if (event.key === 'Tab') {
                    event.preventDefault();
                    const target = event.currentTarget;
                    const start = target.selectionStart;
                    const end = target.selectionEnd;
                    const nextValue = code.substring(0, start) + '    ' + code.substring(end);
                    setCode(nextValue);
                    setTimeout(() => {
                      target.selectionStart = target.selectionEnd = start + 4;
                    }, 0);
                  }
                }}
                onChange={event => {
                  setCode(event.target.value);
                  setFrames([]);
                  setStep(-1);
                  setOutput('');
                  setError('');
                  setState('idle');
                }}
              />
            ) : (
              <div
                className="h-[380px] overflow-auto p-3 font-mono text-xs leading-relaxed bg-[hsl(var(--code-bg))]"
                ref={sourcePanel}
                tabIndex={0}
              >
                {code.split('\n').map((line, index) => {
                  const isActive = frame?.line === index + 1;
                  return (
                    <div
                      key={index}
                      data-active={isActive}
                      className={cn(
                        "flex items-center py-0.5 px-2 rounded-sm transition-colors font-mono whitespace-pre",
                        isActive ? "bg-primary/20 text-primary font-semibold shadow-xs" : "hover:bg-muted/30"
                      )}
                    >
                      <span className="w-5 shrink-0 text-primary">
                        {isActive ? <ArrowRight className="h-3.5 w-3.5 animate-pulse" /> : null}
                      </span>
                      <span className="w-8 shrink-0 text-right pr-3 select-none text-muted-foreground/60 text-[11px]">
                        {index + 1}
                      </span>
                      <code className="text-foreground font-mono whitespace-pre flex-1 text-xs select-text">
                        <Syntax line={line || ' '} />
                      </code>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20 text-[11px] text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", busy ? "bg-amber-500 animate-ping" : "bg-emerald-500")} />
                {busy ? 'Executing PHP WebAssembly…' : frames.length ? `Recorded ${frames.length} steps` : code !== original ? 'Custom code' : 'Ready to run'}
              </span>
              <span>{frame ? `Line ${frame.line}` : `${code.split('\n').length} lines`}</span>
            </div>
          </div>

          {/* Visual State & Output Panel */}
          <div className="flex flex-col min-w-0 bg-card divide-y divide-border">
            {/* Mobile Segmented Inspector Tabs (Compact view on < md) */}
            <div className="md:hidden flex items-center border-b border-border bg-muted/40 p-1 gap-1">
              <button
                type="button"
                onClick={() => setInspectorTab('variables')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-colors min-h-[38px] cursor-pointer",
                  inspectorTab === 'variables'
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/80"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Braces className="h-3.5 w-3.5 text-primary" />
                Variables {frame?.variables ? `(${Object.keys(frame.variables).length})` : ''}
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab('output')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-colors min-h-[38px] cursor-pointer",
                  inspectorTab === 'output'
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/80"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Terminal className="h-3.5 w-3.5 text-emerald-500" />
                Console Output
              </button>
            </div>

            {/* Variables Inspector */}
            <div className={cn("p-4 flex-1 overflow-auto max-h-[260px] md:max-h-[220px]", inspectorTab !== 'variables' && "hidden md:block")}>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Braces className="h-3.5 w-3.5 text-primary" />
                  Variables
                </span>
                <span className="text-[10px] text-muted-foreground">After this step</span>
              </div>

              {Object.entries(frame?.variables || {}).length ? (
                <div className="space-y-1 font-mono text-xs">
                  {Object.entries(frame.variables).map(([name, value]) => {
                    const isChanged = JSON.stringify(previous?.variables?.[name]) !== JSON.stringify(value);
                    return (
                      <div
                        key={name}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-1 rounded border",
                          isChanged ? "border-primary/40 bg-primary/10 text-foreground" : "border-border/60 bg-muted/20 text-muted-foreground"
                        )}
                      >
                        <span className="font-semibold text-blue-500">${name}</span>
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                          {value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value === 'number' ? (Number.isInteger(value) ? 'int' : 'float') : typeof value === 'boolean' ? 'bool' : 'string'}
                        </span>
                        <span className="font-semibold text-foreground">{showValue(value)}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/70 py-4 text-center">
                  {frame ? 'No variables defined yet in this scope.' : 'Run the code or trace to inspect variable values.'}
                </p>
              )}
            </div>

            {/* Output Console */}
            <div className={cn("p-4 flex-1", inspectorTab !== 'output' && "hidden md:block")}>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Terminal className="h-3.5 w-3.5 text-emerald-500" />
                  Console Output
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {frames.length ? 'Through this step' : 'PHP execution result'}
                </span>
              </div>
              <pre className="w-full min-h-[90px] max-h-[140px] overflow-auto p-3 rounded-lg bg-[hsl(var(--code-bg))] font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed border border-border/60">
                {frames.length ? (frame?.output || '// No output yet') : (output || (busy ? 'Loading PHP runtime…' : '// Output will appear here'))}
              </pre>
            </div>
          </div>
        </div>

        {/* Playback & Action Controls (Mobile 2-row layout, Desktop single-row) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-3 sm:px-4 py-3 border-t border-border bg-muted/30">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={run}
              disabled={busy}
              size="sm"
              className="min-h-[42px] sm:min-h-9 px-4 gap-1.5 shadow-sm font-semibold flex-1 sm:flex-initial"
            >
              <Play className="h-4 w-4 fill-current" />
              {busy ? 'Running…' : traceable ? 'Run & Trace' : 'Run PHP'}
            </Button>

            {busy && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => { cleanup(); setState('idle'); setError('Execution stopped.'); }}
                className="min-h-[42px] sm:min-h-9 gap-1.5"
              >
                <Square className="h-3.5 w-3.5 fill-current" /> Stop
              </Button>
            )}

            <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
              <Button
                variant="ghost"
                size="iconSm"
                className="h-10 w-10 sm:h-7 sm:w-7"
                disabled={!frames.length || step <= 0}
                onClick={() => { setPlaying(false); setStep(v => v - 1); }}
                title="Previous step"
              >
                <ArrowLeft className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="iconSm"
                className="h-10 w-10 sm:h-7 sm:w-7"
                disabled={!frames.length}
                onClick={play}
                title={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause className="h-4 w-4 sm:h-3.5 sm:w-3.5 fill-current" /> : <Play className="h-4 w-4 sm:h-3.5 sm:w-3.5 fill-current" />}
              </Button>
              <Button
                variant="ghost"
                size="iconSm"
                className="h-10 w-10 sm:h-7 sm:w-7"
                disabled={!frames.length || step >= frames.length - 1}
                onClick={() => { setPlaying(false); setStep(v => v + 1); }}
                title="Next step"
              >
                <ArrowRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="iconSm"
                className="h-10 w-10 sm:h-7 sm:w-7"
                disabled={!frames.length}
                onClick={() => { setStep(0); setPlaying(false); }}
                title="Restart playback"
              >
                <RotateCcw className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 border-t border-border/40 sm:border-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="hidden sm:inline">Speed:</span>
                <select
                  value={speed}
                  onChange={e => setSpeed(Number(e.target.value))}
                  className="rounded-lg border border-input bg-card px-2 py-1.5 text-xs text-foreground cursor-pointer min-h-[38px] sm:min-h-0"
                >
                  {[0.5, 1, 1.5, 2].map(s => (
                    <option key={s} value={s}>{s}×</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={toggleSound}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer min-h-[38px] sm:min-h-0",
                  soundEnabled
                    ? "border-pink/30 bg-pink/10 text-pink hover:bg-pink/20 shadow-2xs"
                    : "border-hairline bg-surface text-ink-mute hover:bg-surface-2 hover:text-ink opacity-75"
                )}
                title={soundEnabled ? "Execution Sound: ON (click to mute)" : "Execution Sound: OFF (click to unmute)"}
                aria-label={soundEnabled ? "Mute execution sound" : "Enable execution sound"}
              >
                {soundEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 text-pink" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5 text-ink-mute" />
                )}
                <span className="font-mono text-[11px]">{soundEnabled ? "SFX On" : "Muted"}</span>
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="text-xs text-muted-foreground hover:text-foreground min-h-[38px] sm:min-h-0 px-2.5"
            >
              Reset code
            </Button>
          </div>
        </div>

        {/* Timeline Range Bar */}
        <div className="flex items-center gap-3 px-4 py-2 border-t border-border bg-muted/10 text-xs text-muted-foreground">
          <input
            id={`timeline-${id}`}
            type="range"
            min="0"
            max={Math.max(0, frames.length - 1)}
            value={Math.max(0, step)}
            disabled={!frames.length}
            onChange={e => { setPlaying(false); setStep(Number(e.target.value)); }}
            className="flex-1 accent-primary cursor-pointer"
          />
          <span className="font-mono text-[11px] shrink-0">
            {frames.length ? `${step + 1} / ${frames.length} steps` : 'No recording yet'}
          </span>
        </div>
      </div>

      {/* Step Explanation Card */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-primary">
            {frame ? `Line ${frame.line} Execution:` : 'Interactive Exploration'}
          </span>
          <div className="flex items-center gap-1.5">
            {(() => {
              if (!frame) return null;
              const ev = classifyFrameEvent(frame, code, previous, step, frames.length);
              const tag = ev === 'complete' ? '✨ Complete' :
                (typeof ev === 'object' && ev.type === 'output') ? '⌨️ Output write' :
                ev === 'condition-true' ? '🟢 Branch taken' :
                ev === 'condition-false' ? '⚪ Branch skipped' :
                (typeof ev === 'object' && ev.type === 'mutation') ? '🔄 Variable mutated' :
                ev === 'assignment' ? '📝 Assignment' :
                ev === 'iteration' ? '🔁 Next item' :
                ev === 'block-end' ? '↩️ Block end' :
                ev === 'else' ? '🔀 Else branch' : null;
              if (!tag) return null;
              return (
                <span className="inline-flex items-center gap-1 rounded-md border border-hairline bg-surface px-2 py-0.5 text-[10px] font-mono text-ink-mute shadow-2xs">
                  {tag}
                </span>
              );
            })()}
            {frame?.phase === 'condition' && (
              <Badge variant={frame.condition ? 'success' : 'destructive'}>
                condition: {frame.condition ? 'true' : 'false'}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-foreground leading-relaxed text-xs">
          {explanation}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </div>
      )}

      {code !== original && (
        <p className="text-xs text-muted-foreground">
          Custom code runs in PHP without line instrumentation. Reset code to restore the recorded walkthrough.
        </p>
      )}
    </section>
  );
}
