import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Bookmark,
  Mic,
  Code2,
  BarChart3,
  Library,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  KeyRound,
  GraduationCap,
} from 'lucide-react';
import VoiceSettingsModal from '../VoiceSettingsModal.jsx';
import { useApp, AppContext } from '../context/AppContext';

export { useApp, AppContext };

export default function AppLayout() {
  const {
    data,
    setData,
    lang,
    setLanguage,
    theme,
    toggleTheme,
    voiceModalOpen,
    openVoiceSettings,
    closeVoiceSettings,
    isGoogleActive,
    storageError,
  } = useApp();

  const [mobileNav, setMobileNav] = useState(false);
  const location = useLocation();

  // Cancel speech on route change
  useEffect(() => {
    window.speechSynthesis?.cancel();
    setMobileNav(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/', icon: Home, label: 'Home Overview' },
    { to: '/learn', icon: BookOpen, label: 'Study Room' },
    { to: '/saved', icon: Bookmark, label: 'Saved Questions', badge: data?.saved?.length || 0 },
    { to: '/mock', icon: Mic, label: 'Mock Interview' },
    { to: '/code', icon: Code2, label: 'Code Lab' },
    { to: '/progress', icon: BarChart3, label: 'My Progress' },
    { to: '/resources', icon: Library, label: 'Source Library' },
  ];

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col md:flex-row">
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-pink focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>

      {/* Mobile Navigation Backdrop */}
        {mobileNav && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
            onClick={() => setMobileNav(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-hairline bg-bg p-5 flex flex-col transition-transform duration-200 ease-in-out md:sticky md:top-0 md:h-screen md:overflow-y-auto md:shrink-0 ${
            mobileNav ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Brand */}
          <div className="flex items-center justify-between pb-6">
            <NavLink
              to="/learn"
              className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-ink group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-surface text-ink shadow-2xs group-hover:border-pink/40 transition-colors">
                <span className="font-display font-bold text-xs tracking-tighter">
                  IP<span className="text-pink">.</span>
                </span>
              </div>
              <span className="font-display text-lg font-semibold tracking-tight text-ink">
                Inter<span className="text-pink">Prep</span>
              </span>
            </NavLink>

            <button
              onClick={() => setMobileNav(false)}
              className="md:hidden p-1.5 rounded-lg text-ink-mute hover:bg-surface-2 hover:text-ink cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="text-[11px] font-semibold tracking-wider text-ink-mute uppercase px-2 mb-2 font-sans">
            Workspace
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Main navigation">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-3 rounded-xl text-[13px] sm:text-[14px] font-medium transition-all min-h-[44px] active:scale-[0.98] ${
                      isActive
                        ? 'bg-pink/10 text-pink font-semibold shadow-2xs'
                        : 'text-ink-soft hover:bg-surface hover:text-ink'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="inline-flex items-center justify-center h-5 px-2 rounded-full text-[10px] font-semibold bg-surface-2 border border-hairline text-ink-soft">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Track card */}
          <div className="mt-6 pt-5 border-t border-hairline">
            <div className="text-[11px] font-semibold tracking-wider text-ink-mute uppercase px-2 mb-2 font-sans">
              Active Track
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-hairline bg-surface shadow-2xs">
              <span className="rounded-lg border border-hairline bg-surface-2 px-2 py-1 font-mono font-bold text-xs text-pink">
                PHP
              </span>
              <div className="text-xs">
                <strong className="block text-ink font-semibold">PHP & Laravel</strong>
                <span className="text-[11px] text-ink-mute">Full-Stack Practice</span>
              </div>
            </div>
          </div>

          {/* Sidebar Bottom Quote & Storage Status */}
          <div className="mt-auto pt-6 space-y-4">
            <div className="rounded-2xl border border-hairline bg-surface-2 p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-ink">
                <GraduationCap className="h-4 w-4 text-pink" />
                Understanding Beats Memorizing
              </div>
              <p className="text-[11px] text-ink-mute leading-relaxed font-sans">
                One clear concept, one runnable snippet, and one interview-ready answer.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-ink-mute font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" />
              <span>Progress saved locally</span>
            </div>
          </div>
        </aside>

        {/* Main Shell */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-hairline bg-bg/85 backdrop-blur-md px-3 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => setMobileNav(true)}
                className="md:hidden p-2 rounded-xl text-ink-mute hover:bg-surface-2 hover:text-ink cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center -ml-1"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2 font-sans text-xs sm:text-[13px] text-ink-mute truncate">
                <span className="font-semibold text-ink">InterPrep</span>
                <span className="hidden sm:inline text-hairline-2">/</span>
                <strong className="hidden sm:inline text-ink font-medium truncate">PHP & Laravel Interview</strong>
              </div>
            </div>

            {/* Topbar Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Google Voice modal button */}
              <button
                onClick={() => setVoiceModalOpen(true)}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs min-h-[38px] ${
                  isGoogleActive
                    ? 'border-teal/30 bg-teal-soft text-teal hover:bg-teal/20'
                    : 'border-hairline bg-surface text-ink-soft hover:bg-surface-2 hover:text-ink'
                }`}
                title={isGoogleActive ? 'Gemini Voice active · Voice settings' : 'Configure free Google Gemini TTS'}
              >
                {isGoogleActive ? (
                  <Sparkles className="h-3.5 w-3.5 fill-current text-teal shrink-0" />
                ) : (
                  <KeyRound className="h-3.5 w-3.5 text-ink-mute shrink-0" />
                )}
                <span className="hidden md:inline">
                  {isGoogleActive ? 'Gemini Voice' : 'Free Voice'}
                </span>
              </button>

              {/* Language Switcher */}
              <div className="flex items-center rounded-full border border-hairline bg-surface-2 p-0.5 sm:p-1 shadow-2xs">
                <button
                  onClick={() => setData(d => ({ ...d, lang: 'en' }))}
                  className={`rounded-full px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold transition-all cursor-pointer min-h-[32px] ${
                    lang === 'en'
                      ? 'bg-pink text-white shadow-xs'
                      : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  <span className="sm:hidden">EN</span>
                  <span className="hidden sm:inline">English</span>
                </button>
                <button
                  onClick={() => setData(d => ({ ...d, lang: 'hi' }))}
                  className={`rounded-full px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold transition-all cursor-pointer min-h-[32px] ${
                    lang === 'hi'
                      ? 'bg-pink text-white shadow-xs'
                      : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  <span className="sm:hidden">HI</span>
                  <span className="hidden sm:inline">Hinglish</span>
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setData(d => ({ ...d, theme: theme === 'dark' ? 'light' : 'dark' }))}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="grid h-9 w-9 place-items-center rounded-xl border border-hairline bg-surface text-ink hover:bg-surface-2 transition-colors cursor-pointer shadow-2xs"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-sun" /> : <Moon className="h-4 w-4 text-ink" />}
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {storageError && (
              <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                Browser storage is unavailable. Your changes will persist only for this session.
              </div>
            )}
            <Outlet />
          </main>

          {/* App Footer */}
          <footer className="border-t border-hairline px-4 py-5 sm:px-6 text-xs text-ink-mute flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto font-sans">
            <span className="flex items-center gap-1.5">
              <span>Made for deep understanding.</span>
              <span>•</span>
              <span className="text-pink font-semibold">137 Core Concepts</span>
            </span>
            <span>PHP & Laravel · Code With Animation Design System</span>
          </footer>
        </div>

        {/* Global Voice Settings Modal */}
        <VoiceSettingsModal
          isOpen={voiceModalOpen}
          onClose={closeVoiceSettings}
          data={data}
          onSave={settings => setData(d => ({ ...d, ...settings }))}
          currentLang={lang}
        />
      </div>
  );
}
