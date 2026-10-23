import React, { useState, useEffect, createContext, useContext } from 'react';
import { readStore } from '../model.js';
import questions from '../questions.json';

export const AppContext = createContext(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function AppProvider({ children }) {
  const [data, setData] = useState(() => readStore({ getItem: k => window.localStorage.getItem(k) }));
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [storageError, setStorageError] = useState(false);

  const lang = data.lang || 'en';
  const theme = data.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = 'en';
    try {
      localStorage.setItem('interprep-v1', JSON.stringify(data));
      if (data.googleTtsApiKey) {
        localStorage.setItem('google_tts_api_key', data.googleTtsApiKey);
      } else {
        localStorage.removeItem('google_tts_api_key');
      }
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [data, theme, lang]);

  function markProgress(id, value) {
    setData(d => ({
      ...d,
      progress: {
        ...d.progress,
        [id]: value,
      },
    }));
  }

  function toggleSaved(id) {
    setData(d => ({
      ...d,
      saved: d.saved.includes(id)
        ? d.saved.filter(item => item !== id)
        : [...d.saved, id],
    }));
  }

  function setLanguage(newLang) {
    setData(d => ({ ...d, lang: newLang }));
  }

  function toggleTheme() {
    setData(d => ({ ...d, theme: theme === 'dark' ? 'light' : 'dark' }));
  }

  const learnedCount = Object.values(data.progress || {}).filter(v => v === 'learned').length;
  const isGoogleActive = Boolean(data.googleTtsApiKey?.trim());

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        lang,
        setLanguage,
        theme,
        toggleTheme,
        markProgress,
        toggleSaved,
        voiceModalOpen,
        setVoiceModalOpen,
        openVoiceSettings: () => setVoiceModalOpen(true),
        closeVoiceSettings: () => setVoiceModalOpen(false),
        learnedCount,
        totalQuestions: questions.length,
        isGoogleActive,
        storageError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
