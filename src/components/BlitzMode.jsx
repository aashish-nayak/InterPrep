import React, { useState, useEffect, useRef } from 'react';
import { Zap, Clock, Flame, RotateCcw, Award, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { GlowCard } from './lightwind/glow-card';
import { BLITZ_QUESTIONS } from '../lib/blitzQuestions';
import { playExecutionSound } from '../lib/soundFx';
import { cn } from '../lib/utils';

export default function BlitzMode({ onExit }) {
  const [gameState, setGameState] = useState('ready'); // 'ready' | 'playing' | 'summary'
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null); // { isCorrect: bool, idx: number }

  const questionsRef = useRef([]);

  const startBlitz = () => {
    // Shuffle blitz questions
    const shuffled = [...BLITZ_QUESTIONS].sort(() => Math.random() - 0.5);
    questionsRef.current = shuffled;
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setHistory([]);
    setTimeLeft(60);
    setFeedback(null);
    setGameState('playing');
  };

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameState('summary');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const currentQ = questionsRef.current[currentIndex] || BLITZ_QUESTIONS[0];

  const handleSelectOption = (optionIndex) => {
    if (feedback !== null || gameState !== 'playing') return;

    const isCorrect = optionIndex === currentQ.correct;
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);
    if (newStreak > maxStreak) setMaxStreak(newStreak);

    if (isCorrect) {
      const multiplier = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
      setScore(s => s + (10 * multiplier));
      try { playExecutionSound('step', 1.2); } catch {}
    } else {
      try { playExecutionSound('output', 0.8); } catch {}
    }

    setFeedback({ isCorrect, selected: optionIndex });
    setHistory(prev => [
      ...prev,
      {
        question: currentQ,
        selected: optionIndex,
        isCorrect
      }
    ]);

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < questionsRef.current.length) {
        setCurrentIndex(c => c + 1);
      } else {
        // Recycle shuffled questions if candidate is super fast!
        questionsRef.current = [...BLITZ_QUESTIONS].sort(() => Math.random() - 0.5);
        setCurrentIndex(0);
      }
    }, 350);
  };

  if (gameState === 'ready') {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-2">
          <Zap className="h-8 w-8 fill-current" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            60-Second Output Prediction Blitz
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Test your lightning-fast intuition on tricky PHP type coercion, comparisons, and operators under the clock.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-left text-xs">
          <div className="p-3 rounded-lg border border-hairline bg-card/60">
            <div className="text-muted-foreground">Time Limit</div>
            <div className="text-base font-bold text-foreground mt-0.5">60 Seconds</div>
          </div>
          <div className="p-3 rounded-lg border border-hairline bg-card/60">
            <div className="text-muted-foreground">Scoring</div>
            <div className="text-base font-bold text-primary mt-0.5">+10 Pts / Q</div>
          </div>
          <div className="p-3 rounded-lg border border-hairline bg-card/60">
            <div className="text-muted-foreground">Combos</div>
            <div className="text-base font-bold text-amber-500 mt-0.5">Up to 3x</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          {onExit && (
            <Button variant="ghost" size="sm" onClick={onExit}>
              Back
            </Button>
          )}
          <Button
            size="lg"
            onClick={startBlitz}
            className="px-8 bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-md"
          >
            <Zap className="h-4 w-4 mr-1.5 fill-current" />
            Start 60s Blitz
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'summary') {
    const accuracy = history.length > 0
      ? Math.round((history.filter(h => h.isCorrect).length / history.length) * 100)
      : 0;

    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-1">
            <Award className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Blitz Session Complete!
          </h2>
          <p className="text-xs text-muted-foreground">
            Here is your rapid recall breakdown from the 60-second sprint.
          </p>
        </div>

        {/* Score KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <GlowCard className="p-4 text-center">
            <div className="text-xs text-muted-foreground">Final Score</div>
            <div className="text-2xl font-bold text-primary mt-1">{score}</div>
          </GlowCard>
          <GlowCard className="p-4 text-center">
            <div className="text-xs text-muted-foreground">Accuracy</div>
            <div className="text-2xl font-bold text-emerald-500 mt-1">{accuracy}%</div>
          </GlowCard>
          <GlowCard className="p-4 text-center">
            <div className="text-xs text-muted-foreground">Answered</div>
            <div className="text-2xl font-bold text-foreground mt-1">{history.length}</div>
          </GlowCard>
          <GlowCard className="p-4 text-center">
            <div className="text-xs text-muted-foreground">Max Streak</div>
            <div className="text-2xl font-bold text-amber-500 mt-1">{maxStreak} 🔥</div>
          </GlowCard>
        </div>

        {/* Question Review List */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Review Questions ({history.length})
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {history.map((h, i) => (
              <div
                key={i}
                className={cn(
                  "p-3 rounded-lg border text-xs flex items-start justify-between gap-3",
                  h.isCorrect
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-destructive/20 bg-destructive/5"
                )}
              >
                <div className="space-y-1 font-mono">
                  <div className="text-foreground font-semibold">{h.question.code}</div>
                  <div className="text-[11px] text-muted-foreground font-sans">
                    Correct: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{h.question.options[h.question.correct]}</span>
                    {!h.isCorrect && (
                      <span className="ml-2 text-destructive">
                        (You chose: {h.question.options[h.selected]})
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-sans italic">
                    {h.question.rationale}
                  </div>
                </div>
                <div>
                  {h.isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-hairline">
          <Button variant="ghost" size="sm" onClick={onExit}>
            Exit Blitz
          </Button>
          <Button
            size="sm"
            onClick={startBlitz}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  // Active playing state
  return (
    <div className="max-w-xl mx-auto py-6 px-4 space-y-4">
      {/* Top Header: Timer, Score, Streak */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-hairline bg-card/60">
        {/* Timer */}
        <div className="flex items-center gap-2">
          <Clock className={cn("h-4 w-4", timeLeft <= 10 ? "text-destructive animate-pulse" : "text-muted-foreground")} />
          <span className={cn("font-mono text-sm font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>
            {timeLeft}s
          </span>
        </div>

        {/* Streak combo */}
        {streak >= 2 && (
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500 animate-bounce">
            <Flame className="h-4 w-4 fill-current" />
            <span>{streak} Streak! ({streak >= 5 ? '3x' : '2x'} Multiplier)</span>
          </div>
        )}

        {/* Score */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground font-medium">Score:</span>
          <span className="font-mono font-bold text-primary text-sm">{score}</span>
        </div>
      </div>

      {/* Progress Bar of Time */}
      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-1000",
            timeLeft <= 10 ? "bg-destructive" : "bg-amber-500"
          )}
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        />
      </div>

      {/* Question Snippet Card */}
      <div className="rounded-xl border border-hairline bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-muted-foreground">
            Snippet #{currentIndex + 1}
          </span>
          <span className="text-[11px] text-muted-foreground">What does this output?</span>
        </div>

        <div className="p-4 rounded-lg bg-bg border border-hairline font-mono text-xs md:text-sm text-foreground overflow-x-auto whitespace-pre">
          {currentQ.code}
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "border-hairline bg-card hover:bg-muted/60 text-foreground";
            if (feedback !== null) {
              if (idx === currentQ.correct) {
                btnClass = "bg-emerald-500 text-white border-emerald-500 font-bold";
              } else if (idx === feedback.selected) {
                btnClass = "bg-destructive text-white border-destructive font-bold";
              } else {
                btnClass = "opacity-40 border-hairline bg-card";
              }
            }

            return (
              <button
                key={idx}
                disabled={feedback !== null}
                onClick={() => handleSelectOption(idx)}
                className={cn(
                  "p-3 rounded-lg border text-xs font-mono font-medium transition-all text-left flex items-center justify-between",
                  btnClass
                )}
              >
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
