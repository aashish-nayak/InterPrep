import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Play,
  Check,
  ArrowRight,
  RotateCcw,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  Code2,
  Terminal,
  HelpCircle,
  CheckSquare,
  Layers,
  Square,
  Eye,
  EyeOff,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Textarea } from './components/ui/input';
import { usePhpRunner } from './lib/usePhpRunner';
import { prepareSessionQuestions } from './mockQuestions';

export default function MockInterview({ questions, topics, lang = 'en', onComplete }) {
  // Rehearsal Setup state
  const [category, setCategory] = useState('all');
  const [count, setCount] = useState(5);
  const [mode, setMode] = useState('adaptive'); // 'adaptive' | 'mcq' | 'code' | 'open'

  // Session state
  const [session, setSession] = useState(null);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [ratings, setRatings] = useState([]);

  // Question response state
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionSubmitted, setIsOptionSubmitted] = useState(false);
  const [codeDraft, setCodeDraft] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [openDraft, setOpenDraft] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [rating, setRating] = useState('');

  // PHP WebAssembly Execution
  const phpRunner = usePhpRunner();

  // Timer
  useEffect(() => {
    if (!session || finished) return;
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [session, finished, started]);

  // Current question
  const q = session?.[index];

  // Reset per question
  useEffect(() => {
    if (!q) return;
    setSelectedOption(null);
    setIsOptionSubmitted(false);
    setCodeDraft(q.starterCode || '');
    setShowSolution(false);
    setOpenDraft('');
    setRevealed(false);
    setRating('');
    phpRunner.reset();
  }, [index, q]);

  function start() {
    const sessionQuestions = prepareSessionQuestions(questions, {
      category,
      count,
      mode,
    });
    setSession(sessionQuestions);
    setIndex(0);
    setRatings([]);
    setStarted(Date.now());
    setElapsed(0);
    setFinished(false);
  }

  function handleConfirmOption() {
    if (selectedOption === null) return;
    setIsOptionSubmitted(true);
    setRevealed(true);
    const isCorrect = selectedOption === q.correctIndex;
    setRating(isCorrect ? 'confident' : 'review');
  }

  function handleRunCode() {
    phpRunner.runCode(codeDraft);
  }

  function handleResetCode() {
    setCodeDraft(q.starterCode || '');
    phpRunner.reset();
  }

  function next() {
    const isCorrect = q.type === 'mcq' ? selectedOption === q.correctIndex : null;
    const resultItem = {
      id: q.id,
      title: q.title[lang],
      type: q.type,
      rating: rating || (isCorrect ? 'confident' : 'review'),
      selectedOption,
      isCorrect,
      codeOutput: phpRunner.output,
      draft: openDraft,
    };

    const newRatings = [...ratings, resultItem];
    setRatings(newRatings);

    if (index === session.length - 1) {
      setFinished(true);
      const confidentCount = newRatings.filter(r => r.rating === 'confident').length;
      if (onComplete) {
        onComplete({
          date: new Date().toISOString(),
          total: session.length,
          confident: confidentCount,
          seconds: elapsed,
          mode,
          category,
        });
      }
    } else {
      setIndex(prev => prev + 1);
    }
  }

  // Question Type Labels
  const typeBadgeConfig = {
    mcq: { label: 'Multiple Choice', icon: CheckSquare, variant: 'accent' },
    code: { label: 'Code Challenge', icon: Code2, variant: 'default' },
    open: { label: 'Scenario Discussion', icon: Layers, variant: 'secondary' },
  };

  return (
    <section className="space-y-6 max-w-4xl mx-auto">
      {/* Page Title & Breadcrumb */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
          <span>InterPrep</span>
          <span>/</span>
          <span className="text-primary font-semibold">Mock Rehearsal</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Interactive Interview Rehearsal
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Practice multiple choice questions, execute real PHP code challenges, and test your readiness for technical rounds.
        </p>
      </div>

      {!session ? (
        /* SETUP VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Information & Feature Card */}
          <div className="rounded-2xl border border-hairline bg-surface p-6 md:p-8 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink/10 text-pink mb-5">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="font-display text-xl font-bold text-ink">Smart Adaptive Practice</h2>
              <p className="font-sans text-xs text-ink-mute mt-2 leading-relaxed">
                InterPrep automatically picks the best interactive format for each interview question — from instant MCQs to live PHP execution with instant terminal feedback.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div className="rounded-xl border border-hairline bg-surface-2 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink">
                    <CheckSquare className="h-4 w-4" />
                    <span>MCQ</span>
                  </div>
                  <p className="font-sans text-[11px] text-ink-mute mt-1">
                    4 options, immediate rationale & scoring.
                  </p>
                </div>

                <div className="rounded-xl border border-hairline bg-surface-2 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal">
                    <Code2 className="h-4 w-4" />
                    <span>Live Code</span>
                  </div>
                  <p className="font-sans text-[11px] text-ink-mute mt-1">
                    Write code & run in WebAssembly.
                  </p>
                </div>

                <div className="rounded-xl border border-hairline bg-surface-2 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                    <Layers className="h-4 w-4" />
                    <span>Scenarios</span>
                  </div>
                  <p className="font-sans text-[11px] text-ink-mute mt-1">
                    Architecture & trade-off debates.
                  </p>
                </div>
              </div>
            </div>

            <p className="font-sans text-[11px] text-ink-mute mt-6">
              💡 Zero backend required. Code executes safely in your browser via PHP 8.3 WebAssembly.
            </p>
          </div>

          {/* Configuration Card */}
          <div className="rounded-2xl border border-hairline bg-surface p-6 md:p-8 flex flex-col justify-between shadow-2xs">
            <div className="space-y-4">
              <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-pink" />
                Configure Session
              </h3>

              {/* Practice Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink font-sans">Question Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'adaptive', name: 'Smart Adaptive', desc: 'Auto: MCQ + Code' },
                    { id: 'mcq', name: 'MCQs Only', desc: 'Multiple choice tests' },
                    { id: 'code', name: 'Code Challenges', desc: 'Write & execute code' },
                    { id: 'open', name: 'Scenarios Only', desc: 'Architecture review' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                        mode === m.id
                          ? 'border-pink bg-pink/10 text-pink font-semibold shadow-2xs'
                          : 'border-hairline bg-surface-2 text-ink-soft hover:bg-surface'
                      }`}
                    >
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-[10px] text-ink-mute font-normal mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interview Topic */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink font-sans">Interview Topic</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-hairline bg-surface-2 px-3 py-2.5 text-xs text-ink shadow-2xs focus:outline-none focus:ring-2 focus:ring-pink"
                >
                  <option value="all">Mixed interview (All topics)</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Count */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink font-sans">Number of Questions</label>
                <select
                  value={count}
                  onChange={e => setCount(Number(e.target.value))}
                  className="w-full rounded-xl border border-hairline bg-surface-2 px-3 py-2.5 text-xs text-ink shadow-2xs focus:outline-none focus:ring-2 focus:ring-pink"
                >
                  {[5, 10, 15].map(n => (
                    <option key={n} value={n}>
                      {n} questions (~{n * 2} minutes)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button onClick={start} size="lg" className="w-full gap-2 mt-6 min-h-[44px]">
              <Play className="h-4 w-4 fill-current" /> Start Interview Rehearsal
            </Button>
          </div>
        </div>
      ) : finished ? (
        /* RESULTS VIEW */
        <div className="rounded-2xl border border-hairline bg-surface p-6 md:p-8 space-y-6 text-center shadow-raised">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10 text-teal mx-auto">
            <Award className="h-8 w-8" />
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Interview Session Complete!</h2>
            <p className="font-sans text-sm text-ink-mute mt-1">
              You marked yourself confident on{' '}
              <strong className="text-ink font-semibold">
                {ratings.filter(r => r.rating === 'confident').length} of {session.length}
              </strong>{' '}
              questions in {Math.floor(elapsed / 60)}m {elapsed % 60}s.
            </p>
          </div>

          {/* Score cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
            <div className="rounded-xl border border-hairline bg-surface-2 p-3">
              <span className="text-[11px] text-ink-mute font-medium block">Total Questions</span>
              <span className="text-lg font-bold text-ink">{session.length}</span>
            </div>
            <div className="rounded-xl border border-hairline bg-surface-2 p-3">
              <span className="text-[11px] text-ink-mute font-medium block">Confident Answers</span>
              <span className="text-lg font-bold text-teal">
                {ratings.filter(r => r.rating === 'confident').length}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-xl border border-hairline bg-surface-2 p-3">
              <span className="text-[11px] text-ink-mute font-medium block">Time Elapsed</span>
              <span className="text-lg font-bold text-ink font-mono">
                {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Question Breakdown List */}
          <div className="rounded-xl border border-hairline text-left divide-y divide-hairline overflow-hidden bg-surface-2">
            {ratings.map((r, i) => (
              <div key={r.id || i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={r.type === 'code' ? 'default' : r.type === 'mcq' ? 'accent' : 'secondary'} className="text-[10px] px-2 py-0.5">
                      {r.type?.toUpperCase()}
                    </Badge>
                    <span className="font-display text-xs font-semibold text-ink">
                      {i + 1}. {r.title}
                    </span>
                  </div>
                  {r.type === 'mcq' && (
                    <p className="font-sans text-[11px] text-ink-mute">
                      {r.isCorrect ? '✅ Correct option selected' : '❌ Missed or needs review'}
                    </p>
                  )}
                  {r.type === 'code' && r.codeOutput && (
                    <p className="font-mono text-[10px] text-ink-mute line-clamp-1">
                      Output: {r.codeOutput}
                    </p>
                  )}
                  {r.draft && (
                    <p className="font-sans text-[11px] text-ink-mute line-clamp-1 italic">
                      "{r.draft}"
                    </p>
                  )}
                </div>
                <Badge variant={r.rating === 'confident' ? 'success' : 'secondary'} className="shrink-0 self-start sm:self-auto">
                  {r.rating === 'confident' ? 'Confident' : 'Needs Practice'}
                </Badge>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Button onClick={() => setSession(null)} className="gap-2 min-h-[44px]">
              <RotateCcw className="h-4 w-4" /> Practice Another Set
            </Button>
          </div>
        </div>
      ) : (
        /* ACTIVE QUESTION CARD */
        <div className="rounded-2xl border border-hairline bg-surface p-5 sm:p-7 md:p-8 space-y-6 shadow-raised">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="accent">
                Question {index + 1} of {session.length}
              </Badge>
              {(() => {
                const conf = typeBadgeConfig[q.type] || typeBadgeConfig.mcq;
                const IconComponent = conf.icon;
                return (
                  <Badge variant={conf.variant} className="gap-1.5 py-1">
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>{conf.label}</span>
                  </Badge>
                );
              })()}
              <span className="font-sans text-xs text-ink-mute">
                {topics.find(t => t.id === q.category)?.name}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-ink-mute">
              <Clock className="h-3.5 w-3.5 text-pink" />
              <span>
                {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Question Title */}
          <div>
            <h2 className="font-display text-lg md:text-xl font-bold text-ink leading-snug">
              {q.title[lang]}
            </h2>
          </div>

          {/* 1. MCQ QUESTION INTERFACE */}
          {q.type === 'mcq' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2.5">
                {(q.options[lang] || q.options.en).map((optText, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSelected = selectedOption === optIdx;
                  const isCorrect = q.correctIndex === optIdx;

                  let cardStyle = 'border-hairline bg-surface-2 text-ink hover:border-pink/40 hover:bg-surface';
                  let badgeStyle = 'bg-surface text-ink-mute border-hairline';

                  if (isOptionSubmitted) {
                    if (isCorrect) {
                      cardStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 font-medium';
                      badgeStyle = 'bg-emerald-500 text-white border-emerald-500';
                    } else if (isSelected && !isCorrect) {
                      cardStyle = 'border-rose-500 bg-rose-500/10 text-rose-950 dark:text-rose-100';
                      badgeStyle = 'bg-rose-500 text-white border-rose-500';
                    } else {
                      cardStyle = 'border-hairline bg-surface-2/40 text-ink-mute opacity-60';
                    }
                  } else if (isSelected) {
                    cardStyle = 'border-pink bg-pink/10 text-pink font-semibold shadow-2xs';
                    badgeStyle = 'bg-pink text-white border-pink';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isOptionSubmitted}
                      onClick={() => setSelectedOption(optIdx)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 min-h-[48px] ${cardStyle}`}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-bold font-mono ${badgeStyle}`}>
                        {letter}
                      </span>
                      <span className="font-sans text-xs sm:text-sm leading-relaxed pt-0.5 flex-1">
                        {optText}
                      </span>
                      {isOptionSubmitted && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isOptionSubmitted && isSelected && !isCorrect && (
                        <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!isOptionSubmitted ? (
                <div className="pt-2 flex items-center gap-3">
                  <Button
                    disabled={selectedOption === null}
                    onClick={handleConfirmOption}
                    className="gap-2 min-h-[44px] px-5"
                  >
                    Confirm Answer <ArrowRight className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-ink-mute">
                    Select the option you believe is correct.
                  </span>
                </div>
              ) : (
                <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                  {/* Feedback Card */}
                  <div className={`p-4 rounded-xl border ${
                    selectedOption === q.correctIndex
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-rose-500/40 bg-rose-500/5'
                  }`}>
                    <div className="flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider">
                      {selectedOption === q.correctIndex ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Correct Answer!
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4" /> Incorrect Choice
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                      {q.explanation?.[lang] || q.explanation?.en || q.answer?.[lang] || q.answer?.en}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. CODE CHALLENGE QUESTION INTERFACE */}
          {q.type === 'code' && (
            <div className="space-y-4">
              {q.task && (
                <div className="rounded-xl border border-hairline bg-surface-2 p-3 text-xs text-ink-soft flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-teal shrink-0" />
                  <span>{q.task[lang] || q.task.en}</span>
                </div>
              )}

              {/* Code Editor Container */}
              <div className="rounded-xl border border-hairline overflow-hidden bg-zinc-950 shadow-inner">
                {/* Editor Header Bar */}
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800 text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-1 text-[11px] text-zinc-400 font-sans font-medium">PHP 8.3 Runner</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {q.solutionCode && (
                      <button
                        type="button"
                        onClick={() => setShowSolution(!showSolution)}
                        className="text-[11px] text-zinc-400 hover:text-white transition-colors flex items-center gap-1 px-2 py-0.5 rounded border border-zinc-800 hover:border-zinc-700"
                      >
                        {showSolution ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        <span>{showSolution ? 'Hide Solution' : 'View Solution'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleResetCode}
                      className="text-[11px] text-zinc-400 hover:text-white transition-colors flex items-center gap-1 px-2 py-0.5 rounded border border-zinc-800 hover:border-zinc-700"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Editable Code Area */}
                <div className="relative">
                  <textarea
                    rows={8}
                    value={codeDraft}
                    onChange={e => setCodeDraft(e.target.value)}
                    spellCheck={false}
                    className="w-full bg-transparent text-emerald-300 font-mono text-xs sm:text-sm p-4 leading-relaxed focus:outline-none resize-y selection:bg-zinc-800"
                  />
                </div>

                {/* Solution Drawer if toggled */}
                {showSolution && q.solutionCode && (
                  <div className="p-3 bg-zinc-900/90 border-t border-zinc-800">
                    <span className="text-[10px] uppercase font-bold text-teal tracking-wider block mb-1">
                      Reference Solution:
                    </span>
                    <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap overflow-x-auto">
                      {q.solutionCode}
                    </pre>
                  </div>
                )}
              </div>

              {/* Code Controls */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleRunCode}
                  disabled={phpRunner.status === 'running'}
                  className="gap-2 min-h-[44px] px-5"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>{phpRunner.status === 'running' ? 'Running in WebAssembly...' : 'Execute Code'}</span>
                </Button>
                {q.hint && (
                  <span className="text-xs text-ink-mute hidden sm:inline">
                    💡 {q.hint[lang] || q.hint.en}
                  </span>
                )}
              </div>

              {/* Execution Console Output */}
              {(phpRunner.output || phpRunner.error || phpRunner.status === 'running') && (
                <div className="rounded-xl border border-hairline overflow-hidden bg-surface-2 shadow-2xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-hairline bg-surface text-xs font-mono font-medium text-ink-mute">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-pink" />
                      <span>Execution Output</span>
                    </div>
                    {phpRunner.status === 'done' && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Exit Code 0 (Success)
                      </span>
                    )}
                    {phpRunner.status === 'error' && (
                      <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                        Execution Error
                      </span>
                    )}
                  </div>
                  <div className="p-3 bg-zinc-950 font-mono text-xs text-zinc-200 overflow-x-auto whitespace-pre-wrap">
                    {phpRunner.status === 'running' ? (
                      <div className="flex items-center gap-2 text-zinc-400 py-1">
                        <span className="h-3 w-3 rounded-full border-2 border-pink border-t-transparent animate-spin" />
                        <span>Compiling and executing PHP snippet...</span>
                      </div>
                    ) : phpRunner.error ? (
                      <span className="text-rose-400">{phpRunner.error}</span>
                    ) : (
                      <span className="text-emerald-400">{phpRunner.output}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. SCENARIO / OPEN DISCUSSION QUESTION INTERFACE */}
          {q.type === 'open' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink-mute font-sans">
                  Your architecture notes or key talking points (optional):
                </label>
                <Textarea
                  rows={5}
                  value={openDraft}
                  onChange={e => setOpenDraft(e.target.value)}
                  placeholder="1. Definition & core mechanism&#10;2. Production example in Laravel&#10;3. Key performance or scalability tradeoff..."
                  className="rounded-xl border border-hairline bg-surface-2 text-ink placeholder:text-ink-mute text-xs leading-relaxed"
                />
              </div>

              {!revealed ? (
                <div className="pt-1">
                  <Button onClick={() => setRevealed(true)} className="gap-2 min-h-[44px]">
                    Compare with Canonical Answer <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="rounded-2xl border border-hairline bg-surface-2 p-4 sm:p-5 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink uppercase tracking-wider">
                    <BookOpen className="h-4 w-4" />
                    Canonical Reference Answer:
                  </div>
                  <p className="font-sans text-xs md:text-sm text-ink-soft leading-relaxed whitespace-pre-line">
                    {q.answer[lang].replace(/\*\*|`/g, '')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Self-Rating / Confirmation (Shown once checked or revealed) */}
          {(isOptionSubmitted || q.type === 'code' || (q.type === 'open' && revealed)) && (
            <div className="rounded-2xl border border-hairline p-4 bg-surface-2/60 space-y-2.5">
              <span className="font-sans text-xs font-semibold text-ink block">
                How confident do you feel with this question?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all shadow-2xs min-h-[44px] ${
                  rating === 'review'
                    ? 'border-pink bg-pink/10 text-pink font-semibold'
                    : 'border-hairline bg-surface text-ink-soft hover:bg-surface-2'
                }`}>
                  <input
                    type="radio"
                    name="rating"
                    value="review"
                    checked={rating === 'review'}
                    onChange={() => setRating('review')}
                    className="accent-pink h-4 w-4"
                  />
                  Needs more practice
                </label>

                <label className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all shadow-2xs min-h-[44px] ${
                  rating === 'confident'
                    ? 'border-teal bg-teal-soft text-teal font-semibold'
                    : 'border-hairline bg-surface text-ink-soft hover:bg-surface-2'
                }`}>
                  <input
                    type="radio"
                    name="rating"
                    value="confident"
                    checked={rating === 'confident'}
                    onChange={() => setRating('confident')}
                    className="accent-teal h-4 w-4"
                  />
                  I understand this clearly
                </label>
              </div>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-hairline">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSession(null); setFinished(false); }}
              className="text-xs text-ink-mute hover:text-ink min-h-[40px] px-3"
            >
              End Session
            </Button>

            <Button
              disabled={
                q.type === 'mcq'
                  ? !isOptionSubmitted
                  : q.type === 'open'
                  ? !revealed
                  : !rating
              }
              onClick={next}
              className="gap-2 min-h-[44px] px-5"
            >
              <span>{index === session.length - 1 ? 'Finish Interview' : 'Next Question'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
