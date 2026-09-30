'use client';

import React from 'react';
import { useChat } from '../../hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import {
  Wrench,
  Sparkles,
  Loader2,
  Calendar,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const {
    messages,
    diagnosis,
    triggerDiagnosis,
    isDiagnosing,
    activeSessionStatus,
    openBookingModal,
    startNewSession
  } = useChat();

  const canDiagnose = messages.filter((m) => m.sender === 'user').length >= 1;

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/70 shadow-sm dark:shadow-2xl backdrop-blur-xl overflow-hidden transition-all">
      {/* Top Diagnostic Action Subbar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs backdrop-blur-md gap-2 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="flex h-5.5 w-5.5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Wrench className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate text-[11px] sm:text-xs">
            Diagnostic Bay
          </span>

          {/* Session Status Pill */}
          {activeSessionStatus === 'booked' ? (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="h-2.5 w-2.5" /> Booked
            </span>
          ) : activeSessionStatus === 'diagnosed' ? (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold text-amber-600 dark:text-amber-400 shrink-0">
              <Sparkles className="h-2.5 w-2.5" /> Ready
            </span>
          ) : (
            <span className="rounded-full bg-slate-200 dark:bg-slate-800/80 px-1.5 py-0.2 text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400 hidden xs:inline-flex shrink-0">
              Active
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            onClick={startNewSession}
            className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-2 py-1 text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors active:scale-95"
            title="Start new blank session"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset Bay</span>
          </button>

          {diagnosis ? (
            <button
              type="button"
              onClick={() => openBookingModal(diagnosis)}
              className="flex items-center gap-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-1 sm:px-3 text-xs font-bold text-slate-950 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Book</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={triggerDiagnosis}
              disabled={isDiagnosing || !canDiagnose}
              className="flex items-center gap-1 rounded-lg sm:rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/25 to-orange-500/15 px-2.5 py-1 sm:px-3 text-xs font-bold text-amber-600 dark:text-amber-400 transition-all hover:bg-amber-500/30 disabled:opacity-40 shadow-xs active:scale-95"
            >
              {isDiagnosing ? (
                <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              )}
              <span>Diagnose</span>
            </button>
          )}
        </div>
      </div>

      {/* Message Stream */}
      <MessageList />

      {/* Multimodal Input Controls */}
      <ChatInput />
    </div>
  );
};
