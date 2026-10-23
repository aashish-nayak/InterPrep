import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight, BookOpen, Trash2, Search, Play, Volume2 } from 'lucide-react';
import questions from '../questions.json';
import { useApp } from '../layouts/AppLayout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { GlowCard } from '../components/lightwind/glow-card';
import AudioPlayer from '../components/AudioPlayer';

export default function SavedQuestions() {
  const { data, lang, toggleSaved, openVoiceSettings } = useApp();
  const [search, setSearch] = useState('');
  const [activeAudioId, setActiveAudioId] = useState(null);

  const savedQuestions = questions.filter(q => data.saved.includes(q.id));
  const filtered = savedQuestions.filter(q =>
    q.title[lang].toLowerCase().includes(search.toLowerCase()) ||
    q.answer[lang].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <span>Personal Bookmarks</span>
            <span>•</span>
            <span>{savedQuestions.length} Saved</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Keep the good questions close.
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-xl">
            Key concepts and tricky interview scenarios you've earmarked for fast revision.
          </p>
        </div>

        {savedQuestions.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search saved questions..."
              className="w-full rounded-md border border-input bg-card pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(q => {
            const isRunnable = q.code.some(c => c.language === 'php') && !['laravel', 'scenarios', 'sql'].includes(q.category);
            const isAudioActive = activeAudioId === q.id;

            return (
              <GlowCard key={q.id} className="p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="accent" className="text-[10px]">
                        {q.category.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        #{q.id}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSaved(q.id)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                      title="Remove from saved"
                      aria-label="Remove bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {q.title[lang]}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {q.answer[lang].replace(/\*\*|`/g, '')}
                  </p>

                  {/* Inline Audio Player if triggered */}
                  {isAudioActive && (
                    <div className="pt-2">
                      <AudioPlayer
                        key={q.id}
                        text={`${q.title[lang]}. ${q.answer[lang]}`}
                        lang={lang}
                        data={data}
                        onOpenSettings={openVoiceSettings}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border gap-2">
                  <button
                    onClick={() => setActiveAudioId(isAudioActive ? null : q.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium cursor-pointer"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-primary" />
                    <span>{isAudioActive ? 'Hide Audio' : 'Listen'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {isRunnable && (
                      <Link to={`/code/${q.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                          <Play className="h-3 w-3 fill-current" /> Code Lab
                        </Button>
                      </Link>
                    )}
                    <Link to={`/learn/${q.id}`}>
                      <Button size="sm" className="h-7 text-xs gap-1">
                        Study <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlowCard>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center max-w-md mx-auto space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto">
            <Bookmark className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">No saved questions yet</h3>
            <p className="text-xs text-muted-foreground">
              While exploring questions in the Study Room, click the bookmark icon to save key concepts for quick revision.
            </p>
          </div>
          <Link to="/learn">
            <Button size="sm" className="gap-2">
              <BookOpen className="h-4 w-4" /> Explore Questions
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
