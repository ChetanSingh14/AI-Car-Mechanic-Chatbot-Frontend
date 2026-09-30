'use client';

import React from 'react';
import { Diagnosis } from '../../types';
import { SeverityBadge } from '../ui/Badge';
import { Wrench, DollarSign, Clock, AlertTriangle, Calendar, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  onBookMechanic: (diagnosis: Diagnosis) => void;
  onViewFullReport?: (diagnosis: Diagnosis) => void;
}

export const DiagnosisCard: React.FC<DiagnosisCardProps> = ({
  diagnosis,
  onBookMechanic,
  onViewFullReport
}) => {
  return (
    <div className="relative my-2.5 sm:my-3.5 overflow-hidden rounded-xl sm:rounded-2xl border border-amber-500/40 bg-gradient-to-br from-white via-slate-50 to-amber-50/20 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-3.5 sm:p-5 shadow-md dark:shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <span className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Wrench className="h-3 w-3" />
            </span>
            <span>Certified Diagnostic Assessment</span>
          </div>
          <h2 className="text-sm sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5 tracking-tight">
            {diagnosis.issue_title}
          </h2>
          <span className="text-[10px] text-slate-400 dark:text-slate-500" suppressHydrationWarning>
            Generated {formatDate(diagnosis.created_at)} • AutoTech AI Engine
          </span>
        </div>

        <div className="self-start sm:self-auto">
          <SeverityBadge severity={diagnosis.severity} size="sm" />
        </div>
      </div>

      {/* Description & Technical Summary */}
      <div className="py-3 space-y-2.5 sm:space-y-3 text-xs">
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {diagnosis.description}
        </p>

        {/* Safety alert if high or critical */}
        {diagnosis.safety_warning && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-600 dark:text-rose-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
            <p className="leading-normal">{diagnosis.safety_warning}</p>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-2.5 sm:p-3 flex flex-col justify-between shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Wrench className="h-3 w-3 text-amber-500 dark:text-amber-400" />
              Recommended Service
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
              {diagnosis.recommended_service}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-2.5 sm:p-3 flex flex-col justify-between shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <DollarSign className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
              Estimated Cost
            </span>
            <p className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              {diagnosis.estimated_cost}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-2.5 sm:p-3 flex flex-col justify-between shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
              Estimated Labor
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
              {diagnosis.labor_hours || '1.5 - 2.5 hours'}
            </p>
          </div>
        </div>

        {/* Parts breakdown list if present */}
        {diagnosis.parts_needed && diagnosis.parts_needed.length > 0 && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 p-2.5 sm:p-3 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 text-[11px]">
              Required Components
            </span>
            <div className="space-y-1">
              {diagnosis.parts_needed.map((part, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-600 dark:text-slate-400 gap-2">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 truncate">
                    <CheckCircle2 className="h-3 w-3 text-amber-500 dark:text-amber-400 shrink-0" />
                    <span className="truncate">{part.name}</span>
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">{part.cost_estimate}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prominent CTA Footer */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 self-start sm:self-auto">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span>Backed by 12-Month Certified Warranty</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onViewFullReport && (
            <button
              onClick={() => onViewFullReport(diagnosis)}
              className="flex-1 sm:flex-initial rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Spec Sheet
            </button>
          )}

          <button
            onClick={() => onBookMechanic(diagnosis)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 px-4 py-2 text-xs sm:text-sm font-extrabold text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
          >
            <Calendar className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Book Mechanic Now</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
