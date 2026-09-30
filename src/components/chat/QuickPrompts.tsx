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
        return <Disc className="h-3.5 w-3.5 text-amber-400" />;
      case 'engine':
        return <Activity className="h-3.5 w-3.5 text-rose-400" />;
      case 'volume':
        return <Volume2 className="h-3.5 w-3.5 text-cyan-400" />;
      case 'wind':
        return <Wind className="h-3.5 w-3.5 text-sky-400" />;
      case 'flame':
        return <Flame className="h-3.5 w-3.5 text-orange-400" />;
      case 'zap':
        return <Zap className="h-3.5 w-3.5 text-yellow-400" />;
      default:
        return <Sparkles className="h-3.5 w-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="py-2 space-y-2">
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <Sparkles className="h-3 w-3 text-amber-400" />
        <span>Common Symptom Inquiries</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_SYMPTOMS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(item.prompt)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 transition-all hover:border-amber-500/50 hover:bg-slate-800 hover:text-white active:scale-95 disabled:opacity-40"
          >
            {getIcon(item.icon)}
            <span className="font-medium">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
