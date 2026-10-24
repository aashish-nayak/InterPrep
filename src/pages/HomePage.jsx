import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Code2,
  Mic,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CodeBlock from '../components/CodeBlock';
import { BrandLogo } from '../components/BrandLogo.jsx';
import { TipCallout, RememberThisCard } from '../components/Callout';

const supportedRoles = [
  {
    id: 'junior',
    title: 'Junior PHP & Laravel Developer',
    experience: '0 – 2 Years Exp',
    badgeVariant: 'teal',
    badgeText: 'Entry to Associate',
    description:
      'Solidify syntax, language fundamentals, and essential MVC principles that hiring managers use to screen early-career engineers.',
    skills: [
      'PHP 8.x types, coercion, references & nullsafe operator',
      'Basic MVC architecture, routing, controllers & Blade',
      'MySQL CRUD queries, foreign keys & migrations',
      'Output prediction & fundamental string/array operations',
    ],
    sampleQuestion: 'What is the difference between == and === with type juggling?',
    categoryLink: '/learn',
    questionCount: '42 Questions',
  },
  {
    id: 'mid',
    title: 'Mid-Level Full-Stack Laravel Engineer',
    experience: '2 – 5 Years Exp',
    badgeVariant: 'pink',
    badgeText: 'High Demand',
    description:
      'Master the Eloquent ORM, dependency injection, and background job architecture that form the backbone of modern web applications.',
    skills: [
      'OOP principles, interfaces, abstract classes, traits & SOLID',
      'Resolving N+1 queries with eager loading & Query Builder',
      'Laravel Service Container, dependency injection & contracts',
      'Background Queues, Jobs, Events, Listeners & Redis caching',
    ],
    sampleQuestion: 'How does Laravel resolve dependencies automatically in controller methods?',
    categoryLink: '/learn',
    questionCount: '58 Questions',
  },
  {
    id: 'senior',
    title: 'Senior Backend Engineer & Laravel Architect',
    experience: '5+ Years Exp',
    badgeVariant: 'amber',
    badgeText: 'Senior & Staff',
    description:
      'Navigate difficult architectural trade-offs, concurrency issues, database locking, and scaling decisions asked in senior engineering rounds.',
    skills: [
      'Laravel Service Providers lifecycle & deferred binding',
      'Database transactions, row-level locking & deadlock resolution',
      'High-traffic scaling, cache invalidation & microservices',
      'Clean architecture: Repositories vs Action classes vs Domain Services',
    ],
    sampleQuestion: 'How do you prevent race conditions in Laravel balance deductions under heavy concurrency?',
    categoryLink: '/learn',
    questionCount: '25 Questions',
  },
  {
    id: 'api',
    title: 'REST API & Microservices Specialist',
    experience: '2 – 6 Years Exp',
    badgeVariant: 'purple',
    badgeText: 'Specialized Track',
    description:
      'Focused on high-throughput backend APIs, authentication protocols, webhook idempotency, and asynchronous worker resilience.',
    skills: [
      'Sanctum & Passport token / OAuth2 authentication',
      'Idempotent API endpoint design & webhook retry handling',
      'Database index execution plans (EXPLAIN) & query profiling',
      'API rate-limiting, error structures & JSON:API standards',
    ],
    sampleQuestion: 'How do you ensure webhook delivery idempotency under network retries?',
    categoryLink: '/learn',
    questionCount: '30 Questions',
  },
];

const categoryPills = [
  { name: 'PHP Fundamentals', count: 35, tag: 'PHP 8.3' },
  { name: 'Object-Oriented PHP', count: 13, tag: 'OOP & SOLID' },
  { name: 'Coding Challenges', count: 15, tag: 'Logic & Tricky Outputs' },
  { name: 'Laravel Framework', count: 32, tag: 'Laravel 11' },
  { name: 'SQL & Database Indexing', count: 18, tag: 'MySQL' },
  { name: 'Senior Scenarios', count: 9, tag: 'System Architecture' },
  { name: 'Pattern Programs', count: 15, tag: 'Loops & Arrays' },
];

export default function HomePage() {
  const { lang, setLanguage, theme, toggleTheme, learnedCount, totalQuestions } = useApp();

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col font-sans">
      {/* ── Top Navigation Bar (Without Sidebar) ── */}
      <header className="sticky top-0 z-50 border-b border-hairline bg-bg/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-ink group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-surface text-ink shadow-2xs group-hover:border-pink/40 group-hover:shadow-xs transition-all">
                <BrandLogo size={22} symbolColor="#1b1a17" accentColor="#ff477e" />
              </div>
              <span className="font-display text-lg font-semibold tracking-tight text-ink">
                Inter<span className="text-pink font-bold">Prep</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1 font-sans text-[13px] font-medium text-ink-soft">
              <Link to="/" className="px-3 py-1.5 rounded-lg bg-pink/10 text-pink font-semibold">
                Home
              </Link>
              <Link to="/learn" className="px-3 py-1.5 rounded-lg hover:bg-surface hover:text-ink transition-colors">
                Study Room
              </Link>
              <Link to="/code" className="px-3 py-1.5 rounded-lg hover:bg-surface hover:text-ink transition-colors">
                Code Lab (WASM)
              </Link>
              <Link to="/mock" className="px-3 py-1.5 rounded-lg hover:bg-surface hover:text-ink transition-colors">
                Mock Interview
              </Link>
              <Link to="/progress" className="px-3 py-1.5 rounded-lg hover:bg-surface hover:text-ink transition-colors">
                Progress
              </Link>
              <Link to="/resources" className="px-3 py-1.5 rounded-lg hover:bg-surface hover:text-ink transition-colors">
                Resources
              </Link>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center rounded-full border border-hairline bg-surface-2 p-0.5 sm:p-1 shadow-2xs">
              <button
                onClick={() => setLanguage('en')}
                className={`rounded-full px-2 sm:px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer min-h-[32px] sm:min-h-0 ${
                  lang === 'en' ? 'bg-pink text-white shadow-xs' : 'text-ink-soft hover:text-ink'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`rounded-full px-2 sm:px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer min-h-[32px] sm:min-h-0 ${
                  lang === 'hi' ? 'bg-pink text-white shadow-xs' : 'text-ink-soft hover:text-ink'
                }`}
              >
                <span className="sm:hidden">HI</span>
                <span className="hidden sm:inline">Hinglish</span>
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid h-8 w-8 sm:h-8 sm:w-8 place-items-center rounded-xl border border-hairline bg-surface text-ink hover:bg-surface-2 transition-colors cursor-pointer shadow-2xs shrink-0"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-sun" /> : <Moon className="h-4 w-4 text-ink" />}
            </button>

            {/* Main Action */}
            <Link
              to="/learn"
              className="inline-flex items-center gap-1 rounded-lg bg-pink hover:bg-pink-press text-white font-semibold text-xs px-2.5 sm:px-4 py-2 shadow-xs transition-all active:scale-[0.97] shrink-0 min-h-[34px] sm:min-h-0"
            >
              <span className="hidden xs:inline sm:hidden">Practice</span>
              <span className="hidden sm:inline">Start Practicing</span>
              <span className="xs:hidden">Start</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-4 py-1.5 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-pink" />
              <span className="font-sans text-xs font-semibold text-pink uppercase tracking-widest">
                Currently Supporting PHP 8.3 & Laravel 11 Tracks
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink leading-[1.12]">
              The Interview Preparation Platform Built for{' '}
              <span className="text-pink underline decoration-pink/30 decoration-wavy decoration-2 underline-offset-8">
                PHP & Laravel
              </span>{' '}
              Engineers.
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-base sm:text-lg text-ink-soft max-w-2xl mx-auto leading-relaxed">
              Master the exact runtime mechanics, design patterns, framework internals, and architectural trade-offs
              asked in modern hiring rounds. Run live code in WebAssembly, hear bilingual voice explanations, and build
              lasting confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 rounded-xl bg-pink text-white hover:bg-pink-press font-semibold text-sm px-6 py-3 shadow-sm transition-all active:scale-95"
              >
                <span>Explore 137 Interview Questions</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/code"
                className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface hover:bg-surface-2 text-ink font-semibold text-sm px-5 py-3 shadow-2xs transition-all active:scale-95"
              >
                <Code2 className="h-4 w-4 text-pink" />
                <span>Run PHP in Browser (WASM)</span>
              </Link>

              <Link
                to="/mock"
                className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface hover:bg-surface-2 text-ink font-semibold text-sm px-5 py-3 shadow-2xs transition-all active:scale-95"
              >
                <Mic className="h-4 w-4 text-teal" />
                <span>Mock Interview Mode</span>
              </Link>
            </div>

            {/* Stats / Trust Row */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-mute font-sans">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-teal" />
                <strong>137 Core Questions</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-teal" />
                <strong>Real In-Browser PHP 8.3</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-teal" />
                <strong>English & Hinglish Audio</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-teal" />
                <strong>100% Free & Local</strong>
              </span>
            </div>
          </div>

          {/* Interactive Code & Concept Preview */}
          <div className="mt-14 max-w-4xl mx-auto">
            <CodeBlock
              filename="service_container.php"
              language="php"
              code={`<?php

namespace App\\Services;

use App\\Contracts\\PaymentGateway;

// Real interview pattern: Dependency Injection & Container Binding
class OrderService
{
    public function __construct(
        protected PaymentGateway $gateway
    ) {}

    public function process(float $amount): bool
    {
        return $this->gateway->charge($amount);
    }
}

// Laravel automatically resolves this via reflection in Service Providers!`}
              showRunButton={false}
            />
          </div>
        </div>
      </section>

      {/* ── Supported Roles Section (User's Requirement) ── */}
      <section className="py-16 md:py-24 border-b border-hairline bg-surface-2/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="font-sans text-xs font-semibold text-pink uppercase tracking-widest">
              Targeted Career Tracks
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">
              Which Roles Does InterPrep Prepare You For?
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-soft leading-relaxed">
              Technical interview standards vary drastically by seniority and specialty. Our curriculum is mapped directly
              to hiring bars for the following roles:
            </p>
          </div>

          {/* Grid of 4 Supported Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {supportedRoles.map(role => (
              <div
                key={role.id}
                className="rounded-2xl border border-hairline bg-surface p-6 sm:p-7 flex flex-col justify-between shadow-raised hover:border-pink/40 transition-all group"
              >
                <div className="space-y-4">
                  {/* Header badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        role.badgeVariant === 'teal'
                          ? 'bg-teal-soft text-teal border border-teal/20'
                          : role.badgeVariant === 'pink'
                          ? 'bg-pink/10 text-pink border border-pink/20'
                          : role.badgeVariant === 'amber'
                          ? 'bg-warning-soft text-warning border border-warning/20'
                          : 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                      }`}
                    >
                      {role.badgeText}
                    </span>

                    <span className="font-mono text-[11px] text-ink-mute font-medium">{role.experience}</span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-ink group-hover:text-pink transition-colors">
                      {role.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-[13px] text-ink-soft mt-1.5 leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  {/* What interviewers test in this role */}
                  <div className="space-y-2 pt-2">
                    <span className="font-sans text-[11px] font-bold text-ink-mute uppercase tracking-wider block">
                      Core Interview Competencies:
                    </span>
                    <ul className="space-y-1.5 text-xs text-ink-soft font-sans">
                      {role.skills.map((skill, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <Check className="h-3.5 w-3.5 text-teal shrink-0 mt-0.5" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample Question Preview */}
                  <div className="rounded-xl border border-hairline bg-surface-2 p-3 space-y-1 text-xs">
                    <span className="font-mono text-[10px] font-semibold text-pink uppercase block">
                      Typical Interview Question:
                    </span>
                    <p className="font-display text-[12px] font-semibold text-ink italic leading-snug">
                      "{role.sampleQuestion}"
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between">
                  <span className="font-mono text-[11px] text-ink-mute">{role.questionCount}</span>
                  <Link
                    to={role.categoryLink}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink hover:text-pink-press transition-colors group-hover:translate-x-0.5"
                  >
                    <span>Practice Questions</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Curriculum Topics Breakdown ── */}
      <section className="py-16 md:py-20 border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="font-sans text-xs font-semibold text-pink uppercase tracking-widest">
              Curriculum Architecture
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              137 In-Depth Interview Questions Across 7 Modules
            </h2>
            <p className="font-sans text-xs sm:text-sm text-ink-mute leading-relaxed">
              Every question includes a 1-sentence definition, production architectural use case, runnable code snippet,
              and interview delivery tips.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {categoryPills.map((pill, i) => (
              <Link
                key={i}
                to="/learn"
                className="rounded-2xl border border-hairline bg-surface p-4 hover:border-pink/40 hover:bg-surface-2 transition-all shadow-2xs group flex flex-col justify-between h-32"
              >
                <div>
                  <span className="inline-block rounded-md border border-hairline bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-ink-mute font-medium group-hover:text-pink">
                    {pill.tag}
                  </span>
                  <h4 className="font-display text-sm font-bold text-ink mt-2 leading-snug group-hover:text-pink transition-colors">
                    {pill.name}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-xs text-ink-mute pt-2 border-t border-hairline">
                  <span>{pill.count} Questions</span>
                  <ChevronRight className="h-3.5 w-3.5 text-ink-mute group-hover:text-pink" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Learning Experience Pillars ── */}
      <section className="py-16 md:py-24 border-b border-hairline bg-surface-2/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="font-sans text-xs font-semibold text-pink uppercase tracking-widest">
              Study Methodology
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">
              Designed for Deep Understanding
            </h2>
            <p className="font-sans text-sm text-ink-soft">
              Memorizing answers fails in unpredictable live rounds. We train you to think and speak like a senior developer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-hairline bg-surface p-6 space-y-3 shadow-2xs">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink/10 text-pink">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">In-Browser PHP 8.3 Sandbox</h3>
              <p className="font-sans text-xs sm:text-[13px] text-ink-soft leading-relaxed">
                Run tricky type conversions, string manipulation, and loop patterns with real WebAssembly PHP execution.
                No XAMPP, Docker, or server setup required.
              </p>
            </div>

            <div className="rounded-2xl border border-hairline bg-surface p-6 space-y-3 shadow-2xs">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal/10 text-teal">
                <Mic className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">Bilingual Audio & Speech</h3>
              <p className="font-sans text-xs sm:text-[13px] text-ink-soft leading-relaxed">
                Listen to natural, conversational voice explanations in English or Hinglish using Google Gemini TTS.
                Hear how clear interviewers phrase complex concepts.
              </p>
            </div>

            <div className="rounded-2xl border border-hairline bg-surface p-6 space-y-3 shadow-2xs">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-warning/10 text-warning">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">Active Recall & Rehearsal</h3>
              <p className="font-sans text-xs sm:text-[13px] text-ink-soft leading-relaxed">
                Hide answers by default to formulate your own verbal response before reviewing the canonical answer.
                Simulate timed mock interviews with instant self-evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom Callout Banner ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-hairline bg-surface-2 p-8 md:p-12 text-center space-y-5 shadow-raised">
            <span className="font-sans text-xs font-semibold text-pink uppercase tracking-widest">
              Ready to Advance Your Career?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink max-w-2xl mx-auto">
              Start Practicing the 137 PHP & Laravel Questions Today.
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-soft max-w-xl mx-auto leading-relaxed">
              No account required, no payment gates. Everything runs locally in your browser with zero friction.
            </p>
            <div className="pt-2">
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 rounded-xl bg-pink hover:bg-pink-press text-white font-semibold text-sm px-7 py-3.5 shadow-sm transition-all active:scale-95"
              >
                <span>Launch Study Room</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-hairline py-10 bg-bg text-ink-mute font-sans text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BrandLogo size={20} symbolColor="#1b1a17" accentColor="#ff477e" />
            <span className="font-display font-bold text-sm text-ink">
              Inter<span className="text-pink font-bold">Prep</span>
            </span>
            <span>•</span>
            <span>PHP & Laravel Technical Interview System</span>
          </div>

          <div className="flex items-center gap-4 text-ink-soft">
            <Link to="/learn" className="hover:text-ink">
              Study Room
            </Link>
            <Link to="/code" className="hover:text-ink">
              Code Lab
            </Link>
            <Link to="/mock" className="hover:text-ink">
              Mock Interview
            </Link>
            <Link to="/resources" className="hover:text-ink">
              Documentation
            </Link>
          </div>

          <div>
            <span>Designed with Code with Animation aesthetics.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
