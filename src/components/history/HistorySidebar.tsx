'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
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

const emptySubscribe = () => () => {};

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

  // Use standard useSyncExternalStore to detect client hydration without calling setState inside an effect
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

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
          className="fixed inset-0 z-40 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex h-full w-72 sm:w-80 flex-col border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-14 sm:h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-3.5 sm:px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Diagnostic History
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {conversationsHistory.length} saved session{conversationsHistory.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            aria-label="Close History Sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Button: New Session */}
        <div className="p-3">
          <button
            onClick={startNewSession}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            <span>New Diagnostic Session</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search diagnoses, vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-1 space-y-1.5 custom-scrollbar">
          {!isMounted ? (
            <div className="flex h-32 items-center justify-center text-xs text-slate-400">
              Loading saved history...
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="flex h-44 flex-col items-center justify-center text-center p-4 text-slate-400">
              <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-xs font-medium">No diagnostic history found</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {searchQuery ? 'Try a different search query' : 'Your completed troubleshoot sessions will appear here'}
              </p>
            </div>
          ) : (
            filteredHistory.map((conv) => {
              const isActive = conversationId === conv.id;
              const hasDiag = !!conv.diagnosis;
              const isBooked = conv.status === 'booked';

              return (
                <div
                  key={conv.id}
                  onClick={() => loadSession(conv.id)}
                  className={`group relative flex cursor-pointer flex-col rounded-xl border p-2.5 text-left transition-all ${
                    isActive
                      ? 'border-amber-500/60 bg-amber-500/10 dark:bg-amber-500/15 shadow-sm'
                      : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] ${
                          isBooked
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : hasDiag
                            ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isBooked ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : hasDiag ? (
                          <Sparkles className="h-3 w-3" />
                        ) : (
                          <Car className="h-3 w-3" />
                        )}
                      </div>

                      <h3 className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                        {conv.title || 'Diagnostic Session'}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                      title="Delete session"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Vehicle Tag & Status Badge */}
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[130px]">
                      {conv.car_make
                        ? `${conv.car_year || ''} ${conv.car_make} ${conv.car_model || ''}`.trim()
                        : 'Unspecified vehicle'}
                    </span>

                    <span className="shrink-0" suppressHydrationWarning>
                      {formatRelativeTime(conv.updated_at || conv.created_at)}
                    </span>
                  </div>

                  {/* Diagnosis snippet badge if exists */}
                  {conv.diagnosis && (
                    <div className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-purple-600 dark:text-purple-400 truncate">
                      <span className="truncate">🔧 {conv.diagnosis.issue_title}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 p-3 text-center">
          <p className="text-[10px] text-slate-400">
            AutoTech Master Diagnostic Assistant
          </p>
        </div>
      </aside>
    </>
  );
};
