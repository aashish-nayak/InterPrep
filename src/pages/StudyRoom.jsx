import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  Bookmark,
  Search,
  X,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Code2,
  RotateCcw,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import questions from '../questions.json';
import { selectQuestions } from '../model.js';
import { useApp } from '../layouts/AppLayout';
import Markdown from '../components/Markdown';
import AudioPlayer from '../components/AudioPlayer';
import CodeBlock from '../components/CodeBlock';
import { TipCallout, MistakeCallout, RememberThisCard } from '../components/Callout';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

const topics = [
  { id: 'php', name: 'PHP fundamentals', short: 'PHP', description: 'Types, variables & essentials' },
  { id: 'oop', name: 'Object-oriented PHP', short: 'OOP', description: 'Objects, contracts & clean design' },
  { id: 'coding', name: 'Coding challenges', short: 'CODE', description: 'Arrays, strings & tricky outputs' },
  { id: 'laravel', name: 'Laravel', short: 'LARAVEL', description: 'From request to response' },
  { id: 'sql', name: 'SQL & MySQL', short: 'SQL', description: 'Queries, indexes & transactions' },
  { id: 'scenarios', name: 'Senior scenarios', short: 'SENIOR', description: 'Decisions beyond the code' },
  { id: 'patterns', name: 'Pattern programs', short: 'LOOPS', description: 'See loops take shape' },
];

export default function StudyRoom() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { data, lang, markProgress, toggleSaved, openVoiceSettings, learnedCount, totalQuestions } = useApp();

  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState(() => (paramId ? Number(paramId) : 1));
  const [tab, setTab] = useState('explain');
  const [showAnswer, setShowAnswer] = useState(true);
  const [mobileTab, setMobileTab] = useState('detail'); // 'detail' | 'list' on mobile

  // Sync selectedId with route param if available
  useEffect(() => {
    if (paramId) {
      const parsed = Number(paramId);
      if (!isNaN(parsed) && questions.some(q => q.id === parsed)) {
        setSelectedId(parsed);
      }
    }
  }, [paramId]);

  const filtered = selectQuestions(questions, {
    query,
    category,
    savedOnly: false,
    saved: data.saved,
    progress: data.progress,
    status,
  });

  const q = filtered.find(item => item.id === selectedId) || filtered[0] || questions[0];

  function chooseQuestion(newId) {
    setSelectedId(newId);
    setTab('explain');
    setShowAnswer(true);
    setMobileTab('detail'); // Auto-switch to question detail view on mobile
    navigate(`/learn/${newId}`, { replace: true });
  }

  const questionIndex = filtered.findIndex(item => item.id === q?.id);
  const isSaved = q ? data.saved.includes(q.id) : false;
  const currentStatus = q ? data.progress[q.id] : null;

  return (
    <div className="space-y-6">
      {/* Header Banner matching CodeWithAnimation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 font-sans text-xs font-semibold text-pink uppercase tracking-widest mb-1.5">
            <span>Interview Curriculum</span>
            <span className="text-hairline-2">•</span>
            <span>137 Concepts</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-ink leading-tight">
            The Complete PHP & Laravel Practice
          </h1>
          <p className="font-sans text-[14px] sm:text-[15px] text-ink-soft mt-1.5 max-w-2xl leading-relaxed">
            Understand the core architecture, test code in WebAssembly, and prepare interview-ready explanations.
          </p>
        </div>

        {/* Progress Card */}
        <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface p-3.5 shadow-2xs shrink-0 self-start sm:self-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink/10 text-pink">
            <Check className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <strong className="text-base font-bold text-ink">
              {learnedCount} <span className="text-xs font-normal text-ink-mute">/ {totalQuestions}</span>
            </strong>
            <span className="block text-[11px] text-ink-mute font-sans">Concepts mastered</span>
          </div>
        </div>
      </div>

      {/* Topic Horizontal Filter Strip with codewithanimation pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0" aria-label="Topics">
        <button
          onClick={() => { setCategory('all'); setStatus('all'); }}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer select-none min-h-[36px]",
            category === 'all'
              ? "bg-pink text-white border-pink shadow-xs"
              : "border-hairline bg-surface text-ink-soft hover:bg-surface-2 hover:text-ink"
          )}
        >
          All Topics ({questions.length})
        </button>

        {topics.map(topic => {
          const count = questions.filter(item => item.category === topic.id).length;
          const isSelected = category === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => { setCategory(topic.id); setStatus('all'); }}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer select-none min-h-[36px]",
                isSelected
                  ? "bg-pink text-white border-pink shadow-xs"
                  : "border-hairline bg-surface text-ink-soft hover:bg-surface-2 hover:text-ink"
              )}
            >
              {topic.name} <span className="opacity-75 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Mobile View Switcher: Segmented control to toggle between Question Detail and Question Browser on phones */}
      <div className="flex lg:hidden items-center p-1 rounded-xl border border-hairline bg-surface-2 shadow-2xs">
        <button
          onClick={() => setMobileTab('detail')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all min-h-[44px] cursor-pointer",
            mobileTab === 'detail'
              ? "bg-pink text-white shadow-xs"
              : "text-ink-soft hover:text-ink"
          )}
        >
          <BookOpen className="h-4 w-4" />
          <span>Active Question</span>
        </button>
        <button
          onClick={() => setMobileTab('list')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all min-h-[44px] cursor-pointer",
            mobileTab === 'list'
              ? "bg-pink text-white shadow-xs"
              : "text-ink-soft hover:text-ink"
          )}
        >
          <Search className="h-4 w-4" />
          <span>Browse Questions ({filtered.length})</span>
        </button>
      </div>

      {/* Study Grid: Question Browser (Left) + Detail Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-hairline bg-surface overflow-hidden shadow-raised min-h-[640px]">
        {/* Left: Question Browser List */}
        <div className={cn(
          "lg:col-span-5 border-b lg:border-b-0 lg:border-r border-hairline bg-surface-2/40 flex-col max-h-[760px]",
          mobileTab === 'detail' ? "hidden lg:flex" : "flex"
        )}>
          {/* Search Bar */}
          <div className="p-3.5 border-b border-hairline space-y-2.5 bg-surface">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-ink-mute pointer-events-none" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search concept (e.g. N+1, Traits, DI)..."
                className="w-full rounded-xl border border-hairline bg-surface-2 pl-8 pr-8 py-2 text-xs text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-pink"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 p-0.5 text-ink-mute hover:text-ink cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* List Status Filter */}
            <div className="flex items-center justify-between text-[11px] text-ink-mute font-sans">
              <span>{filtered.length} questions matching</span>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="rounded-lg border border-hairline bg-surface px-2.5 py-1 text-[11px] text-ink cursor-pointer shadow-2xs"
              >
                <option value="all">All statuses</option>
                <option value="unread">Not started</option>
                <option value="review">To review</option>
                <option value="learned">Learned</option>
              </select>
            </div>
          </div>

          {/* Scrollable Question Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-hairline">
            {filtered.map(item => {
              const isSelected = q?.id === item.id;
              const itemStatus = data.progress[item.id];
              const isItemSaved = data.saved.includes(item.id);
              const catObj = topics.find(t => t.id === item.category);

              return (
                <button
                  key={item.id}
                  onClick={() => chooseQuestion(item.id)}
                  className={cn(
                    "w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer select-none",
                    isSelected
                      ? "bg-pink/10 border-l-4 border-l-pink"
                      : "hover:bg-surface"
                  )}
                >
                  <span className="font-mono text-[11px] text-ink-mute shrink-0 pt-0.5">
                    {String(item.id).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <strong className={cn("text-xs font-semibold leading-snug line-clamp-2 font-display", isSelected ? "text-pink" : "text-ink")}>
                      {item.title[lang]}
                    </strong>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-ink-mute font-sans">
                      <span className="font-semibold text-pink">{catObj?.short}</span>
                      <span>•</span>
                      <span>{item.level}</span>
                      <span>•</span>
                      <span>
                        {itemStatus === 'learned' ? 'Learned' : itemStatus === 'review' ? 'Review' : 'Not started'}
                      </span>
                    </div>
                  </div>

                  {isItemSaved ? (
                    <Bookmark className="h-3.5 w-3.5 text-pink fill-current shrink-0 mt-0.5" />
                  ) : itemStatus === 'learned' ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal shrink-0 mt-0.5" />
                  ) : null}
                </button>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-8 text-center text-xs text-ink-mute space-y-3">
                <Search className="h-6 w-6 mx-auto text-pink opacity-60" />
                <p>No questions matched your search or filters.</p>
                <button
                  onClick={() => { setQuery(''); setCategory('all'); setStatus('all'); }}
                  className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-xs text-ink hover:bg-surface-2 cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Question Detail Panel */}
        {q ? (
          <article className={cn(
            "lg:col-span-7 p-4 sm:p-7 md:p-8 flex-col justify-between overflow-y-auto bg-surface",
            mobileTab === 'list' ? "hidden lg:flex" : "flex"
          )}>
            <div>
              {/* Mobile Quick Action to switch to question list */}
              <button
                onClick={() => setMobileTab('list')}
                className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-surface hover:text-ink shadow-2xs mb-4 min-h-[36px]"
              >
                <Search className="h-3.5 w-3.5 text-pink" />
                <span>Browse all {filtered.length} questions</span>
              </button>

              {/* Question Meta Badges */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-hairline px-3 py-1 text-xs font-semibold text-ink-soft">
                    {topics.find(t => t.id === q.category)?.name}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-surface-2 border border-hairline px-2.5 py-1 text-[11px] font-medium text-ink-mute">
                    {q.level}
                  </span>
                  <span className="text-[11px] text-ink-mute font-mono">
                    Concept #{q.id} of 137
                  </span>
                </div>

                <button
                  onClick={() => toggleSaved(q.id)}
                  title={isSaved ? "Remove from saved" : "Save question"}
                  aria-label={isSaved ? "Remove from saved" : "Save question"}
                  className="p-1.5 rounded-lg border border-hairline bg-surface hover:bg-surface-2 text-ink cursor-pointer transition-colors shadow-2xs"
                >
                  <Bookmark className={cn("h-4 w-4", isSaved ? "fill-pink text-pink" : "text-ink-mute")} />
                </button>
              </div>

              {/* Title */}
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink leading-[1.2] mb-5">
                {q.title[lang]}
              </h2>

              {/* Tabs: Simple Explanation vs Code Example vs Recall Mode */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTab('explain')}
                    className={cn(
                      "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      tab === 'explain'
                        ? "bg-pink text-white shadow-xs"
                        : "text-ink-soft hover:bg-surface-2 hover:text-ink"
                    )}
                  >
                    Explanation
                  </button>
                  <button
                    onClick={() => setTab('code')}
                    className={cn(
                      "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                      tab === 'code'
                        ? "bg-pink text-white shadow-xs"
                        : "text-ink-soft hover:bg-surface-2 hover:text-ink"
                    )}
                  >
                    <span>Code Snippets</span>
                    {q.code?.length > 0 && (
                      <span className={cn(
                        "rounded-full px-1.5 py-0.2 text-[10px]",
                        tab === 'code' ? "bg-white/20 text-white" : "bg-surface-2 text-ink-mute border border-hairline"
                      )}>
                        {q.code.length}
                      </span>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-surface-2 hover:text-ink cursor-pointer transition-all shadow-2xs"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-pink" />
                  <span>{showAnswer ? 'Active Recall Mode' : 'Show Answer'}</span>
                </button>
              </div>

              {/* Answer Content */}
              {!showAnswer ? (
                /* Active Recall Box */
                <div className="rounded-2xl border border-hairline bg-surface-2 p-6 text-center space-y-4 my-6 shadow-2xs">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pink/10 text-pink">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    Explain this concept aloud in your own words.
                  </h3>
                  <p className="font-sans text-[14px] text-ink-soft max-w-md mx-auto leading-relaxed">
                    State the definition, cite a real project scenario in PHP/Laravel, and identify one trade-off or pitfall. When ready, reveal the canonical answer.
                  </p>
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="rounded-lg bg-pink text-white font-semibold text-xs px-4 py-2 hover:bg-pink-press transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    Reveal Canonical Answer
                  </button>
                </div>
              ) : tab === 'explain' ? (
                /* Explanation Tab */
                <div className="space-y-6">
                  {/* Audio Player with Gemini TTS */}
                  <AudioPlayer
                    key={q.id}
                    text={`${q.title[lang]}. ${q.answer[lang]}`}
                    lang={lang}
                    data={data}
                    onOpenSettings={openVoiceSettings}
                  />

                  {/* Formatted Markdown */}
                  <Markdown text={q.answer[lang]} />

                  {/* Tip Callout matching CodeWithAnimation */}
                  <TipCallout title="Interview Delivery Tip">
                    Start with a 1-sentence definition. Mention an actual production use case in Laravel or PHP, then address performance or security trade-offs.
                  </TipCallout>

                  {/* Common Mistake callout if applicable or general advice */}
                  {q.level === 'Senior' && (
                    <MistakeCallout
                      title="Common mistake"
                      subtitle="Don't just recite syntax"
                    >
                      Senior interviewers test architectural judgment. Be prepared to discuss failure modes, scaling bottlenecks, and alternative approaches.
                    </MistakeCallout>
                  )}

                  {q.id === 47 && (
                    <a
                      href="https://www.php.net/manual/en/language.operators.precedence.php"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink hover:underline"
                    >
                      <span>PHP Evaluation-Order Reference</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ) : (
                /* Code Examples Tab */
                <div className="space-y-6">
                  {q.code && q.code.length > 0 ? (
                    q.code.map((c, i) => (
                      <CodeBlock
                        key={i}
                        code={c.text}
                        language={c.language}
                        filename={c.language === 'php' ? `example_${i + 1}.php` : `${c.language}_snippet`}
                        questionId={q.id}
                        showRunButton={c.language === 'php' && !['laravel', 'scenarios', 'sql'].includes(q.category)}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-ink-mute space-y-2 rounded-2xl border border-hairline bg-surface-2">
                      <Code2 className="h-6 w-6 mx-auto text-pink opacity-60" />
                      <p>This conceptual question focuses on architecture and has no standalone code.</p>
                    </div>
                  )}

                  {['laravel', 'scenarios', 'sql'].includes(q.category) && q.code?.length > 0 && (
                    <p className="text-[12px] text-ink-mute font-sans leading-relaxed">
                      * Reference code: requires a configured database/Laravel environment; does not run inside the isolated PHP client sandbox.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Answer Footer with Progress Feedback & Pagination */}
            <div className="mt-8 pt-5 border-t border-hairline flex flex-wrap items-center justify-between gap-4 font-sans">
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-mute">Rate mastery:</span>
                <button
                  onClick={() => markProgress(q.id, 'review')}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-3 sm:px-3.5 py-2 sm:py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs min-h-[44px] sm:min-h-0",
                    currentStatus === 'review'
                      ? "border-warning/30 bg-warning-soft text-warning"
                      : "border-hairline bg-surface-2 text-ink-soft hover:bg-surface hover:text-ink"
                  )}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Review Later</span>
                </button>
                <button
                  onClick={() => markProgress(q.id, 'learned')}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 sm:py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 min-h-[44px] sm:min-h-0",
                    currentStatus === 'learned'
                      ? "bg-teal text-white"
                      : "bg-pink text-white hover:bg-pink-press"
                  )}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{currentStatus === 'learned' ? 'Mastered' : 'Got It'}</span>
                </button>
              </div>

              {/* Prev / Next Pagination */}
              <div className="flex items-center gap-2">
                <button
                  disabled={questionIndex <= 0}
                  onClick={() => chooseQuestion(filtered[questionIndex - 1].id)}
                  aria-label="Previous question"
                  title="Previous question"
                  className="grid h-10 w-10 sm:h-8 sm:w-8 place-items-center rounded-lg border border-hairline bg-surface text-ink hover:bg-surface-2 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                </button>
                <span className="text-xs text-ink-mute font-medium px-1 font-mono">
                  {questionIndex + 1} / {filtered.length}
                </span>
                <button
                  disabled={questionIndex >= filtered.length - 1}
                  onClick={() => chooseQuestion(filtered[questionIndex + 1].id)}
                  aria-label="Next question"
                  title="Next question"
                  className="grid h-10 w-10 sm:h-8 sm:w-8 place-items-center rounded-lg border border-hairline bg-surface text-ink hover:bg-surface-2 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs"
                >
                  <ArrowRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                </button>
              </div>
            </div>
          </article>
        ) : (
          <div className="lg:col-span-7 p-12 text-center text-ink-mute flex flex-col items-center justify-center space-y-3 bg-surface">
            <BookOpen className="h-10 w-10 text-pink opacity-60" />
            <h3 className="font-display text-lg font-bold text-ink">Select a concept to start</h3>
            <p className="font-sans text-xs max-w-sm">
              Pick any interview question from the left browser to view explanations and runnable code.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

