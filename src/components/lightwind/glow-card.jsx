import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function GlowCard({ children, className, glowColor = "from-primary/20 via-pink-500/10 to-transparent", ...props }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative rounded-xl border border-border/80 bg-card p-6 text-card-foreground shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md",
        className
      )}
      {...props}
    >
      {/* Ambient gradient glow on hover */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r",
          glowColor
        )}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
