import React from 'react';
import { AlertTriangle, Lightbulb, CheckCircle2, BookmarkCheck } from 'lucide-react';

export function TipCallout({ title = 'Tip', children, className = '' }) {
  return (
    <div
      className={`flex gap-4 rounded-2xl p-5 sm:p-6 ring-1 ring-teal/20 bg-teal-soft/80 shadow-xs md:gap-5 text-left ${className}`}
    >
      <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-teal text-white shadow-[0_4px_10px_rgba(22,184,166,0.32)]">
        <Lightbulb className="h-5 w-5" />
      </div>
      <div className="space-y-1 min-w-0">
        <span className="font-sans text-[12px] font-bold text-teal uppercase tracking-wider block">
          {title}
        </span>
        <div className="text-[14px] leading-relaxed text-ink-soft">
          {children}
        </div>
      </div>
    </div>
  );
}

export function MistakeCallout({
  title = 'Common mistake',
  subtitle,
  children,
  className = '',
}) {
  return (
    <div
      className={`flex gap-4 rounded-2xl p-5 sm:p-6 ring-1 ring-warning/20 bg-warning-soft/80 shadow-xs md:gap-5 text-left ${className}`}
    >
      <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-warning text-white shadow-[0_4px_10px_rgba(242,153,74,0.35)]">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="space-y-1 min-w-0">
        <span className="font-sans text-[12px] font-bold text-warning uppercase tracking-wider block">
          {title}
        </span>
        {subtitle && (
          <h4 className="font-display text-[16px] font-semibold tracking-tight text-ink">
            {subtitle}
          </h4>
        )}
        <div className="text-[14px] leading-relaxed text-ink-soft">
          {children}
        </div>
      </div>
    </div>
  );
}

export function RememberThisCard({ title = 'Remember this', points = [], children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-hairline bg-surface-2 p-6 text-left shadow-2xs space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-pink/15 text-pink">
          <BookmarkCheck className="h-4 w-4" />
        </div>
        <h3 className="font-display text-base sm:text-lg font-semibold tracking-tight text-ink">
          {title}
        </h3>
      </div>

      {points.length > 0 ? (
        <ul className="space-y-2.5 text-[14px] text-ink-soft">
          {points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2.5 leading-relaxed">
              <span className="h-1.5 w-1.5 rounded-full bg-teal mt-2 shrink-0" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-[14px] leading-relaxed text-ink-soft">{children}</div>
      )}
    </div>
  );
}
