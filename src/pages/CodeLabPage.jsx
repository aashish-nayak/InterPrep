import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Code2, Database } from 'lucide-react';
import CodeLab from '../CodeLab';
import SqlPlayground from '../components/SqlPlayground';
import questions from '../questions.json';
import { useApp } from '../layouts/AppLayout';
import { cn } from '../lib/utils';

export default function CodeLabPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useApp();
  const [activeTab, setActiveTab] = useState('php'); // 'php' | 'sql'

  const initialId = id ? Number(id) : 112;

  function handleSelectQuestion(newId) {
    navigate(`/code/${newId}`, { replace: true });
  }

  return (
    <div className="space-y-6">
      {/* Top Engine Mode Switcher */}
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-xl border border-hairline">
          <button
            onClick={() => setActiveTab('php')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeTab === 'php'
                ? "bg-bg text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="h-4 w-4 text-primary" />
            <span>PHP 8.3 WebAssembly Lab</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeTab === 'sql'
                ? "bg-bg text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Database className="h-4 w-4 text-primary" />
            <span>Interactive SQL Playground</span>
          </button>
        </div>
      </div>

      {activeTab === 'php' ? (
        <CodeLab
          questions={questions}
          initialId={initialId}
          lang={lang}
          compact={false}
          onSelectQuestion={handleSelectQuestion}
        />
      ) : (
        <SqlPlayground />
      )}
    </div>
  );
}
