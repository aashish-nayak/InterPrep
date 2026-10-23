import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import './index.css';

import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import AppLayout from './layouts/AppLayout';
import StudyRoom from './pages/StudyRoom';
import SavedQuestions from './pages/SavedQuestions';
import MockInterviewPage from './pages/MockInterviewPage';
import CodeLabPage from './pages/CodeLabPage';
import ProgressPage from './pages/ProgressPage';
import ResourcesPage from './pages/ResourcesPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Home Page: Dedicated landing page WITHOUT sidebar */}
          <Route path="/" element={<HomePage />} />

          {/* App Workspace Routes: WITH Sidebar and App Layout */}
          <Route element={<AppLayout />}>
            <Route path="learn" element={<StudyRoom />} />
            <Route path="learn/:id" element={<StudyRoom />} />
            <Route path="saved" element={<SavedQuestions />} />
            <Route path="mock" element={<MockInterviewPage />} />
            <Route path="code" element={<CodeLabPage />} />
            <Route path="code/:id" element={<CodeLabPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
