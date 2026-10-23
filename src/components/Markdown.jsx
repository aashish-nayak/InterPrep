import React from 'react';

function Inline({ text }) {
  return String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('`')) {
      return (
        <code
          key={i}
          className="rounded px-1.5 py-0.5 font-mono text-[0.88em] font-medium text-ink bg-surface-2 border border-hairline inline-block align-baseline shadow-2xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**')) {
      return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function Markdown({ text }) {
  if (!text) return null;
  return (
    <div className="space-y-4 text-[15px] sm:text-[15.5px] text-ink-soft leading-[1.8] font-sans">
      {text.split(/\n\s*\n/).filter(Boolean).map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          <Inline text={p.replace(/\n/g, ' ').replace(/^\s*-\s+/, '• ')} />
        </p>
      ))}
    </div>
  );
}
