'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import {
  Plus,
  MessageSquare,
  Trash2,
  Search,
  Sparkles,
  CheckCircle2,
  X,
  History,
  Car
} from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';

export const HistorySidebar: React.FC = () => {
  const {
    conversationsHistory,
    conversationId,
    loadSession,
    deleteSession,
    startNewSession,
    isSidebarOpen,
    setIsSidebarOpen
  } = useChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredHistory = useMemo(() => {
    if (!isMounted) return [];
    if (!searchQuery.trim()) return conversationsHistory;
    const q = searchQuery.toLowerCase();
    return conversationsHistory.filter(
      (c) =>
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.car_make && c.car_make.toLowerCase().includes(q)) ||
        (c.car_model && c.car_model.toLowerCase().includes(q)) ||
        (c.diagnosis && c.diagnosis.issue_title.toLowerCase().includes(q))
    );
  }, [conversationsHistory, searchQuery, isMounted]);

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-80 flex-col border-r border-slate-800/80 bg-slate-950/95 p-4 backdrop-blur-2xl transition-transform duration-300 md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & New Diagnostic Button */}
        <div className="space-y-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-200">
              <History className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Diagnostic History</span>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={startNewSession}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>New Diagnostic Session</span>
          </button>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search previous issues / cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500/60 focus:outline-none"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
          {!isMounted || filteredHistory.length === 0 ? (
            <div className="text-center py-10 px-2 space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-slate-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">No diagnostic history found</p>
              <p className="text-[11px] text-slate-600">
                {searchQuery ? 'Try a different search term.' : 'Your saved troubleshooting chats will appear here.'}
              </p>
            </div>
          ) : (
            filteredHistory.map((conv) => {
              const isActive = conv.id === conversationId;
              const hasDiag = !!conv.diagnosis;
              const isBooked = conv.status === 'booked';

              return (
                <div
                  key={conv.id}
                  onClick={() => loadSession(conv.id)}
                  className={`group relative cursor-pointer rounded-2xl border p-3 transition-all ${
                    isActive
                      ? 'border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/5'
                      : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                        {conv.title || 'Diagnostic Session'}
                      </p>

                      {/* Vehicle tag */}
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                        <Car className="h-3 w-3 text-slate-500 shrink-0" />
                        <span className="truncate">
                          {conv.car_make ? `${conv.car_year || ''} ${conv.car_make} ${conv.car_model || ''}`.trim() : 'Generic Car'}
                        </span>
                      </div>
                    </div>

                    {/* Delete session button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition-all"
                      title="Delete this session"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Status Pills */}
                  <div className="mt-2.5 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[10px]">
                    <span className="text-slate-500" suppressHydrationWarning>{formatRelativeTime(conv.updated_at || conv.created_at)}</span>

                    {isBooked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.2 font-bold text-emerald-400">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Booked
                      </span>
                    ) : hasDiag ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.2 font-bold text-amber-400">
                        <Sparkles className="h-2.5 w-2.5" /> Diagnosed
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.2 text-slate-400">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info badge */}
        <div className="border-t border-slate-800/80 pt-3 text-[11px] text-slate-500 flex items-center justify-between">
          <span>AutoTech Hub v2.4</span>
          <span className="text-amber-400/80 font-medium">ASE Certified AI</span>
        </div>
      </aside>
    </>
  );
};
