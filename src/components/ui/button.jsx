import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-pink text-white shadow-xs hover:bg-pink-press",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:opacity-90",
        outline:
          "border border-hairline bg-surface text-ink hover:bg-surface-2 hover:text-ink shadow-2xs",
        secondary:
          "border border-hairline bg-surface-2 text-ink-soft hover:bg-surface hover:text-ink shadow-2xs",
        ghost: "hover:bg-surface-2 hover:text-ink",
        link: "text-pink underline-offset-4 hover:underline",
        accent: "bg-pink/10 text-pink border border-pink/20 hover:bg-pink/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-6 text-sm",
        icon: "h-8 w-8 p-0 rounded-lg",
        iconSm: "h-7 w-7 p-0 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
