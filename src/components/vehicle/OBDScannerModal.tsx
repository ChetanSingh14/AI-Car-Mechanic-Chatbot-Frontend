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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/80 backdrop-blur-xl animate-in zoom-in-95">
        <button
          onClick={() => setIsOBDModalOpen(false)}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 text-cyan-400 mb-1">
          <Binary className="h-5 w-5" />
          <h3 className="text-lg font-bold text-slate-100">OBD-II Diagnostic Trouble Codes</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Select a fault code retrieved from your vehicle scanner or search below to analyze symptoms with AI.
        </p>

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search code (e.g. P0300, P0420, Misfire...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Codes list */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {filteredCodes.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No matching OBD-II codes found. You can describe the custom code directly in chat!
            </div>
          ) : (
            filteredCodes.map((obd: OBDCode) => (
              <div
                key={obd.code}
                onClick={() => insertOBDCode(obd)}
                className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 transition-all hover:border-cyan-500/50 hover:bg-slate-950 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-cyan-400">{obd.code}</span>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-medium">
                      {obd.category}
                    </span>
                    <SeverityBadge severity={obd.severity} size="sm" />
                  </div>
                  <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {obd.title}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Symptoms: {obd.symptoms.join(' • ')}
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-xl bg-slate-800/60 px-3 py-1.5 text-xs font-semibold text-slate-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shrink-0 ml-3">
                  <span>Diagnose</span>
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
