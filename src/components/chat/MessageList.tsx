'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { DiagnosisCard } from '../diagnosis/DiagnosisCard';
import { Wrench, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export const MessageList: React.FC = () => {
  const {
    messages,
    mediaAttachments,
    diagnosis,
    isLoading,
    isDiagnosing,
    error,
    openBookingModal
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, diagnosis, isLoading, isDiagnosing]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
      {/* Render All Messages */}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} mediaAttachments={mediaAttachments} />
      ))}

      {/* AI Processing / Analyzing Loading Indicator */}
      {isLoading && (
        <div className="flex gap-3 my-4 animate-in fade-in">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-amber-400">
            <Wrench className="h-4 w-4 animate-spin" />
          </div>
          <div className="flex items-center gap-2.5 rounded-3xl border border-slate-800/90 bg-slate-900/90 px-4 py-3 text-xs text-slate-300 shadow-md backdrop-blur-sm">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            <span>Master Technician inspecting vehicle telemetry & formulating response...</span>
          </div>
        </div>
      )}

      {/* Diagnosing In-Progress Indicator */}
      {isDiagnosing && (
        <div className="my-4 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 p-5 shadow-2xl backdrop-blur-md animate-pulse text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold">
            <Sparkles className="h-5 w-5 animate-spin" />
          </div>
          <h4 className="text-sm font-bold text-slate-100">Generating Technical Diagnosis & Repair Estimation</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Cross-referencing acoustic data, manufacturer OBD fault tables, and certified labor hours...
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
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
