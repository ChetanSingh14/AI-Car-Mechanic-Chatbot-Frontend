'use client';

import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { COMMON_OBD_CODES } from '../../lib/constants';
import { OBDCode } from '../../types';
import { X, Binary, Search, ChevronRight } from 'lucide-react';
import { SeverityBadge } from '../ui/Badge';

export const OBDScannerModal: React.FC = () => {
  const { isOBDModalOpen, setIsOBDModalOpen, insertOBDCode } = useChat();
  const [search, setSearch] = useState('');

  if (!isOBDModalOpen) return null;

  const filteredCodes = COMMON_OBD_CODES.filter(
    (item) =>
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 dark:bg-slate-950/80 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90dvh] flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 text-slate-900 dark:text-slate-100">
        <button
          onClick={() => setIsOBDModalOpen(false)}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100 transition-colors shrink-0"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 mb-1 shrink-0">
          <Binary className="h-4 w-4 sm:h-5 sm:w-5" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">OBD-II Fault Trouble Codes</h3>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-3 shrink-0">
          Select a fault code retrieved from your vehicle OBD scanner or search below to analyze root causes with AI.
        </p>

        {/* Search input */}
        <div className="relative mb-3 shrink-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search code (e.g. P0300, P0420, Misfire...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Codes list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0 text-xs">
          {filteredCodes.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching OBD-II codes found. You can describe any custom code directly in chat!
            </div>
          ) : (
            filteredCodes.map((obd: OBDCode) => (
              <div
                key={obd.code}
                onClick={() => insertOBDCode(obd)}
                className="group cursor-pointer rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 p-3 sm:p-3.5 transition-all hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-950 flex items-center justify-between gap-2"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-cyan-600 dark:text-cyan-400">{obd.code}</span>
                    <span className="rounded-md bg-slate-200 dark:bg-slate-800 px-1.5 py-0.2 text-[9px] sm:text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                      {obd.category}
                    </span>
                    <SeverityBadge severity={obd.severity} size="sm" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate">
                    {obd.title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    Symptoms: {obd.symptoms.join(' • ')}
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-lg sm:rounded-xl bg-slate-200/80 dark:bg-slate-800/60 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shrink-0 ml-1">
                  <span className="hidden xs:inline">Diagnose</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
