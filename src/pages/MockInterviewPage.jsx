import React from 'react';
import MockInterview from '../MockInterview';
import questions from '../questions.json';
import { useApp } from '../layouts/AppLayout';

const topics = [
  { id: 'php', name: 'PHP fundamentals' },
  { id: 'oop', name: 'Object-oriented PHP' },
  { id: 'coding', name: 'Coding challenges' },
  { id: 'laravel', name: 'Laravel' },
  { id: 'sql', name: 'SQL & MySQL' },
  { id: 'scenarios', name: 'Senior scenarios' },
  { id: 'patterns', name: 'Pattern programs' },
];

export default function MockInterviewPage() {
  const { lang, setData } = useApp();

  function handleComplete(result) {
    setData(d => ({
      ...d,
      history: [result, ...(d.history || [])].slice(0, 20),
    }));
  }

  return (
    <div className="space-y-6">
      <MockInterview
        questions={questions}
        topics={topics}
        lang={lang}
        onComplete={handleComplete}
      />
    </div>
  );
}
