'use client';

import React from 'react';
import { useChat } from '../../hooks/useChat';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useChat();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0">
      {toasts.map((toast) => {
        let icon = <Info className="h-4 w-4 text-cyan-400 shrink-0" />;
        let border = 'border-cyan-500/30 bg-slate-900/95';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
          border = 'border-emerald-500/40 bg-slate-900/95';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />;
          border = 'border-rose-500/40 bg-slate-900/95';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />;
          border = 'border-amber-500/40 bg-slate-900/95';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${border} p-3.5 shadow-2xl shadow-black/60 backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 text-xs">
              <p className="font-bold text-slate-100">{toast.title}</p>
              {toast.message && <p className="text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-slate-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
