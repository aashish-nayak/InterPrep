import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function AnimatedTabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-lg bg-secondary/80 p-1 border border-border/60", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors select-none cursor-pointer",
              isActive ? "text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 z-[-1] rounded-md bg-primary shadow-xs"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-1 rounded-full px-1.5 py-0.2 text-[10px]",
                  isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
