import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeLab from '../CodeLab';
import questions from '../questions.json';
import { useApp } from '../layouts/AppLayout';

export default function CodeLabPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useApp();

  const initialId = id ? Number(id) : 112;

  function handleSelectQuestion(newId) {
    navigate(`/code/${newId}`, { replace: true });
  }

  return (
    <div className="space-y-6">
      <CodeLab
        questions={questions}
        initialId={initialId}
        lang={lang}
        compact={false}
        onSelectQuestion={handleSelectQuestion}
      />
    </div>
  );
}
