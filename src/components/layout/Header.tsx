'use client';

import React from 'react';
import { useChat } from '../../hooks/useChat';
import {
  Wrench,
  Calendar,
  Sparkles,
  Menu,
  Car,
  Activity,
  Plus
} from 'lucide-react';

interface HeaderProps {
  onOpenBookingLookup: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBookingLookup }) => {
  const {
    isBackendConnected,
    toggleSidebar,
    setIsMyBookingsOpen,
    bookings,
    vehicle,
    startNewSession
  } = useChat();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 py-3 sm:px-6 shadow-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Left Branding & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white md:hidden transition-colors"
            aria-label="Toggle history menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-orange-600 shadow-lg shadow-amber-500/20">
              <Wrench className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-100">
                  AutoTech <span className="text-amber-400">AI</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.2 text-[10px] font-bold text-amber-400">
                  <Sparkles className="h-3 w-3" /> Master Technician
                </span>
              </div>
              <p className="hidden xs:block text-[11px] text-slate-400">
                Automotive Diagnostics & Precision Repair Dispatch
              </p>
            </div>
          </div>
        </div>

        {/* Center Active Vehicle Capsule (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3.5 py-1 text-xs text-slate-300">
          <Car className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-semibold text-slate-200">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Backend Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
            <span
              className={`h-2 w-2 rounded-full ${
                isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px]">
              {isBackendConnected ? 'AI Service Online' : 'AI Offline Simulator'}
            </span>
          </div>

          {/* New Diagnostic Session (Desktop shortcut) */}
          <button
            onClick={startNewSession}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-500/50 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Plus className="h-3.5 w-3.5 text-amber-400" />
            <span>New Diagnostic</span>
          </button>

          {/* Lookup Booking by ID */}
          <button
            onClick={onOpenBookingLookup}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-500/50 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Lookup Ref</span>
          </button>

          {/* My Bookings Launcher */}
          <button
            onClick={() => setIsMyBookingsOpen(true)}
            className="relative flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/10 hover:from-amber-400 hover:to-orange-400 transition-all hover:scale-105 active:scale-95"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Bookings</span>
            {bookings.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 text-[9px] font-extrabold text-amber-400">
                {bookings.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
