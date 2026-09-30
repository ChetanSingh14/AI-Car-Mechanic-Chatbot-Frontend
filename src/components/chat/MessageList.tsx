'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { DiagnosisCard } from '../diagnosis/DiagnosisCard';
import { Wrench, Loader2, Sparkles, AlertCircle, Disc, Volume2, Wind, Flame, Zap, Binary, Camera, Mic } from 'lucide-react';
import { QUICK_SYMPTOMS } from '../../lib/constants';

export const MessageList: React.FC = () => {
  const {
    messages,
    mediaAttachments,
    diagnosis,
    isLoading,
    isDiagnosing,
    error,
    openBookingModal,
    sendMessage,
    setIsOBDModalOpen
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, diagnosis, isLoading, isDiagnosing]);

  const isInitialState = messages.length <= 1 && messages[0]?.id.startsWith('welcome');

  const getSymptomIcon = (icon: string) => {
    switch (icon) {
      case 'disc':
        return <Disc className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />;
      case 'engine':
        return <Wrench className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />;
      case 'volume':
        return <Volume2 className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />;
      case 'wind':
        return <Wind className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />;
      case 'flame':
        return <Flame className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />;
      case 'zap':
        return <Zap className="h-3.5 w-3.5 text-yellow-500 dark:text-yellow-400" />;
      default:
        return <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-2.5 sm:p-4 lg:p-5 space-y-2.5 sm:space-y-3.5 min-h-0">
      {/* Render All Messages */}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} mediaAttachments={mediaAttachments} />
      ))}

      {/* Interactive Quick Launch Cards if user just opened a new session */}
      {isInitialState && (
        <div className="my-2 sm:my-3 rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-slate-50/80 dark:bg-slate-900/40 p-3 sm:p-4 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-200">
                Common Symptoms
              </h3>
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Tap to evaluate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {QUICK_SYMPTOMS.map((symptom, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(symptom.prompt)}
                className="group flex items-start gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 p-2.5 text-left transition-all hover:border-amber-500/50 hover:bg-slate-100 dark:hover:bg-slate-900 active:scale-[0.98]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-500 dark:text-amber-400 group-hover:bg-amber-500/10 transition-colors mt-0.5">
                  {getSymptomIcon(symptom.icon)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors truncate">
                      {symptom.title}
                    </p>
                    <span className="rounded-full bg-slate-100 dark:bg-slate-900 px-1.5 py-0.2 text-[8px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                      {symptom.category}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {symptom.prompt}
                  </p>
                </div>
              </button>
            ))}

            {/* OBD Code Shortcut Card */}
            <button
              type="button"
              onClick={() => setIsOBDModalOpen(true)}
              className="group flex items-start gap-2.5 rounded-xl border border-cyan-500/30 bg-cyan-50/50 dark:bg-cyan-950/20 p-2.5 text-left transition-all hover:border-cyan-400 hover:bg-cyan-100/50 dark:hover:bg-cyan-950/40 active:scale-[0.98]"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/40 border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 mt-0.5">
                <Binary className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300">OBD Trouble Codes</p>
                  <span className="rounded-full bg-cyan-100 dark:bg-cyan-900/50 px-1.5 py-0.2 text-[8px] font-bold text-cyan-700 dark:text-cyan-300 shrink-0">
                    Scanner
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  P0300, P0420, and standard fault codes
                </p>
              </div>
            </button>
          </div>

          {/* Multimodal Guidance footer */}
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-3 sm:gap-4 border-t border-slate-200 dark:border-slate-800/60 pt-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Camera className="h-3 w-3 text-amber-500 dark:text-amber-400" /> Photo & Video
            </span>
            <span className="flex items-center gap-1">
              <Mic className="h-3 w-3 text-rose-500 dark:text-rose-400" /> Engine audio clip
            </span>
            <span className="flex items-center gap-1">
              <Wrench className="h-3 w-3 text-emerald-500 dark:text-emerald-400" /> Certified quotes
            </span>
          </div>
        </div>
      )}

      {/* AI Processing / Analyzing Loading Indicator */}
      {isLoading && (
        <div className="flex gap-2 sm:gap-3 my-2.5 sm:my-3 animate-in fade-in">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 text-amber-500 dark:text-amber-400">
            <Wrench className="h-4 w-4 animate-spin" />
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 shadow-xs backdrop-blur-sm">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500 dark:text-amber-400 shrink-0" />
            <span className="text-xs">Inspecting vehicle telemetry...</span>
          </div>
        </div>
      )}

      {/* Diagnosing In-Progress Indicator */}
      {isDiagnosing && (
        <div className="my-3 rounded-2xl border border-amber-500/40 bg-amber-50/50 dark:bg-gradient-to-r dark:from-amber-500/10 dark:via-orange-500/10 dark:to-amber-500/10 p-4 shadow-md backdrop-blur-md animate-pulse text-center space-y-1.5">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold">
            <Sparkles className="h-4.5 w-4.5 animate-spin" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
            Generating Technical Diagnosis & Repair Estimation
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Cross-referencing manufacturer fault tables and certified labor hours...
          </p>
        </div>
      )}

      {/* Render Diagnosis Card if available */}
      {diagnosis && (
        <DiagnosisCard
          diagnosis={diagnosis}
          onBookMechanic={openBookingModal}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
