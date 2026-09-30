import React from 'react';
import { SeverityLevel } from '../../types';
import { ShieldAlert, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className = '', size = 'md' }) => {
  const config = {
    low: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
      icon: <CheckCircle2 className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />,
      label: 'Low Severity'
    },
    medium: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
      icon: <AlertTriangle className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />,
      label: 'Moderate / Inspect'
    },
    high: {
      bg: 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400',
      icon: <AlertTriangle className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />,
      label: 'High Priority'
    },
    critical: {
      bg: 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400 animate-pulse',
      icon: <ShieldAlert className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />,
      label: 'Critical Hazard'
    }
  }[severity.toLowerCase() as SeverityLevel] || {
    bg: 'bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400',
    icon: <Shield className="h-3 w-3" />,
    label: severity
  };

  const padClass = size === 'sm' ? 'px-1.5 py-0.2 text-[9px] sm:text-[10px]' : 'px-2 py-0.5 text-[10px] sm:text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold tracking-wide ${padClass} ${config.bg} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
