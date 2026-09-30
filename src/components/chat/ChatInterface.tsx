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
    <div className="flex flex-col h-[calc(100vh-160px)] sm:h-[calc(100vh-140px)] rounded-3xl border border-slate-800/90 bg-slate-950/70 shadow-2xl shadow-black/80 backdrop-blur-xl overflow-hidden">
      {/* Top Diagnostic Action Subbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 bg-slate-900/50 px-4 py-2.5 text-xs backdrop-blur-md gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Wrench className="h-3.5 w-3.5" />
          </span>
          <span className="font-semibold text-slate-300">Virtual Diagnostic Bay</span>

          {/* Session Status Pill */}
          {activeSessionStatus === 'booked' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Booked
            </span>
          ) : activeSessionStatus === 'diagnosed' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
              <Sparkles className="h-3 w-3" /> Report Ready
            </span>
          ) : (
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
              Live Session
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={startNewSession}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
            title="Start new blank session"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset Bay</span>
          </button>

          {diagnosis ? (
            <button
              type="button"
              onClick={() => openBookingModal(diagnosis)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 font-bold text-slate-950 shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Book Appointment</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={triggerDiagnosis}
              disabled={isDiagnosing || !canDiagnose}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-orange-500/10 px-3.5 py-1 font-bold text-amber-400 transition-all hover:bg-amber-500/30 hover:border-amber-500 hover:text-amber-300 disabled:opacity-40 shadow-sm"
            >
              {isDiagnosing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>Generate Diagnosis</span>
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
