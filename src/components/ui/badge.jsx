import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-pink focus:ring-offset-1 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-pink text-white shadow-xs",
        secondary:
          "border-hairline bg-surface-2 text-ink-soft",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-xs",
        outline: "border-hairline bg-surface text-ink-soft",
        accent: "border-pink/20 bg-pink/10 text-pink",
        success: "border-teal/30 bg-teal-soft text-teal",
        warning: "border-warning/30 bg-warning-soft text-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
