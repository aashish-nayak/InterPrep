import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, CheckCircle2, RotateCcw, Mic, ArrowRight, Award, Flame, Calendar } from 'lucide-react';
import questions from '../questions.json';
import { useApp } from '../layouts/AppLayout';
import { GlowCard } from '../components/lightwind/glow-card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const topics = [
  { id: 'php', name: 'PHP fundamentals', description: 'Types, variables & the essentials' },
  { id: 'oop', name: 'Object-oriented PHP', description: 'Objects, contracts & clean design' },
  { id: 'coding', name: 'Coding challenges', description: 'Arrays, strings & tricky outputs' },
  { id: 'laravel', name: 'Laravel', description: 'From request to response' },
  { id: 'sql', name: 'SQL & MySQL', description: 'Queries, indexes & transactions' },
  { id: 'scenarios', name: 'Senior scenarios', description: 'Decisions beyond the code' },
  { id: 'patterns', name: 'Pattern programs', description: 'See loops take shape' },
];

export default function ProgressPage() {
  const { data, learnedCount, totalQuestions } = useApp();

  const reviewCount = Object.values(data.progress || {}).filter(v => v === 'review').length;
  const history = data.history || [];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <span>Analytics & Progress</span>
          <span>•</span>
          <span>Device Persistent</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Small steps add up to mastery.
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-xl">
          An honest, transparent view of what you've learned and what needs a revision pass. All progress stays safely in this browser.
        </p>
      </div>

      {/* Primary 3 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlowCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Concepts Mastered</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {learnedCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {Math.round((learnedCount / totalQuestions) * 100)}% of total {totalQuestions} questions
            </p>
          </div>
        </GlowCard>

        <GlowCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Ready for Revision</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <RotateCcw className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {reviewCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Marked "Review Later" during study
            </p>
          </div>
        </GlowCard>

        <GlowCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Interviews Completed</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {history.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Self-assessed mock rehearsals
            </p>
          </div>
        </GlowCard>
      </div>

      {/* Progress Breakdown by Topic */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">Mastery by Topic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topics.map(topic => {
            const topicQuestions = questions.filter(q => q.category === topic.id);
            const done = topicQuestions.filter(q => data.progress[q.id] === 'learned').length;
            const pct = Math.round((done / topicQuestions.length) * 100);

            return (
              <Link
                key={topic.id}
                to={`/learn`}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-xs"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <strong className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      {topic.name}
                    </strong>
                    <p className="text-[11px] text-muted-foreground">
                      {topic.description}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-medium text-muted-foreground shrink-0">
                    {done} / {topicQuestions.length}
                  </span>
                </div>

                <div className="space-y-1 mt-2">
                  <Progress value={done} max={topicQuestions.length} className="h-2" />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{pct}% complete</span>
                    <span className="group-hover:translate-x-0.5 transition-transform text-primary font-medium flex items-center gap-0.5">
                      Practice <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Practice History */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">Recent Practice Sessions</h2>
        {history.length > 0 ? (
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden shadow-xs">
            {history.map((h, i) => (
              <div key={i} className="p-4 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mic className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      {h.confident} / {h.total} Confident Answers
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(h.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {h.seconds ? (
                        <>
                          <span>•</span>
                          <span>{Math.floor(h.seconds / 60)}m {h.seconds % 60}s</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                <Badge variant={h.confident >= h.total * 0.7 ? 'success' : 'secondary'}>
                  Self-Assessed
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-3">
            <Mic className="h-6 w-6 text-primary mx-auto opacity-60" />
            <p className="text-xs text-muted-foreground">
              You haven't completed any mock interviews yet. Try your first rehearsal session!
            </p>
            <Link to="/mock">
              <Button size="sm" className="gap-2">
                Start Mock Interview <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
