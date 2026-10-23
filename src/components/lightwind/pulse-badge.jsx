import React from 'react';
import { cn } from '../../lib/utils';

export function PulseBadge({
  children,
  variant = 'default',
  pulse = true,
  className,
  dotColor,
}) {
  const variantStyles = {
    default: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
    secondary: "bg-secondary text-secondary-foreground border-border",
  };

  const defaultDot = {
    default: "bg-primary",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    secondary: "bg-muted-foreground",
  };

  const dotBg = dotColor || defaultDot[variant] || "bg-primary";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium tracking-tight",
        variantStyles[variant] || variantStyles.default,
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              dotBg
            )}
          />
          <span className={cn("relative inline-flex h-2 w-2 rounded-full", dotBg)} />
        </span>
      )}
      {children}
    </span>
  );
}
