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
    <div className="relative my-4 overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-5 sm:p-6 shadow-2xl shadow-black/60 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3">
      {/* Subtle background glow */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/20 text-amber-400">
              <Wrench className="h-3 w-3" />
            </span>
            <span>Certified Diagnostic Assessment</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 mt-1 tracking-tight">
            {diagnosis.issue_title}
          </h2>
          <span className="text-[11px] text-slate-500">
            Generated {formatDate(diagnosis.created_at)} • AutoTech AI Engine
          </span>
        </div>

        <SeverityBadge severity={diagnosis.severity} />
      </div>

      {/* Description & Technical Summary */}
      <div className="py-4 space-y-4">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {diagnosis.description}
        </p>

        {/* Safety alert if high or critical */}
        {diagnosis.safety_warning && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <p className="leading-normal">{diagnosis.safety_warning}</p>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5 text-amber-400" />
              Recommended Service
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-100 mt-1">
              {diagnosis.recommended_service}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
              Estimated Cost Range
            </span>
            <p className="text-base sm:text-lg font-black text-emerald-400 mt-1">
              {diagnosis.estimated_cost}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              Estimated Labor Time
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-100 mt-1">
              {diagnosis.labor_hours || '1.5 - 2.5 hours'}
            </p>
          </div>
        </div>

        {/* Parts breakdown list if present */}
        {diagnosis.parts_needed && diagnosis.parts_needed.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3.5 text-xs">
            <span className="font-semibold text-slate-300 block mb-2">Required Components & Parts</span>
            <div className="space-y-1.5">
              {diagnosis.parts_needed.map((part, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <CheckCircle2 className="h-3 w-3 text-amber-400" />
                    {part.name}
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">{part.cost_estimate}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prominent CTA Footer */}
      <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Backed by 12-Month / 12,000-Mile Certified Warranty</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onViewFullReport && (
            <button
              onClick={() => onViewFullReport(diagnosis)}
              className="flex-1 sm:flex-initial rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
            >
              Full Spec Sheet
            </button>
          )}

          <button
            onClick={() => onBookMechanic(diagnosis)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-slate-950 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.03] active:scale-[0.98] group"
          >
            <Calendar className="h-4 w-4 stroke-[2.5]" />
            <span>Book Mechanic Now</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
