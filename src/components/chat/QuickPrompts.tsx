'use client';

import React from 'react';
import { QUICK_SYMPTOMS } from '../../lib/constants';
import { Sparkles, Disc, Activity, Volume2, Wind, Flame, Zap } from 'lucide-react';

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelectPrompt, disabled }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'disc':
        return <Disc className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />;
      case 'engine':
        return <Activity className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-rose-500 dark:text-rose-400 shrink-0" />;
      case 'volume':
        return <Volume2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-500 dark:text-cyan-400 shrink-0" />;
      case 'wind':
        return <Wind className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-sky-500 dark:text-sky-400 shrink-0" />;
      case 'flame':
        return <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-orange-500 dark:text-orange-400 shrink-0" />;
      case 'zap':
        return <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500 dark:text-yellow-400 shrink-0" />;
      default:
        return <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />;
    }
  };

  return (
    <div className="py-1 space-y-1.5">
      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
        {QUICK_SYMPTOMS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(item.prompt)}
            className="flex items-center gap-1.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 px-2 py-1 text-xs text-slate-700 dark:text-slate-300 transition-all hover:border-amber-500/50 hover:bg-slate-100 dark:hover:bg-slate-850 active:scale-95 disabled:opacity-40"
          >
            {getIcon(item.icon)}
            <span className="font-medium text-[11px] sm:text-xs truncate max-w-[200px]">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
