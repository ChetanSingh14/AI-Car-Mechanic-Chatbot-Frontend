'use client';

import React from 'react';
import { useChat } from '../../hooks/useChat';
import {
  Wrench,
  Calendar,
  Sparkles,
  Menu,
  Car,
  Search,
  Plus,
  Sun,
  Moon
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
    startNewSession,
    theme,
    toggleTheme
  } = useChat();

  return (
    <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl px-2.5 py-2 sm:px-5 sm:py-2.5 shadow-sm dark:shadow-xl transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-1.5 sm:gap-4">
        {/* Left Branding & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={toggleSidebar}
            className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all active:scale-95 md:hidden"
            aria-label="Toggle history menu"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-orange-500 shadow-md shadow-amber-500/20 shrink-0">
              <Wrench className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-slate-100">
                  AutoTech <span className="text-amber-500 dark:text-amber-400">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.2 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-2.5 w-2.5" /> Master Tech
                </span>
              </div>
              <p className="hidden lg:block text-[10px] text-slate-500 dark:text-slate-400">
                Precision Automotive Diagnostics & Dispatch
              </p>
            </div>
          </div>
        </div>

        {/* Center Active Vehicle Capsule (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800/90 bg-slate-100 dark:bg-slate-900/60 px-3.5 py-1 text-xs text-slate-700 dark:text-slate-300 backdrop-blur-md">
          <Car className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-500/40 transition-all active:scale-95"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Backend Status Indicator (Desktop) */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/70 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300">
            <span
              className={`h-2 w-2 rounded-full shrink-0 ${
                isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {isBackendConnected ? 'Live AI Engine' : 'Local AI Engine'}
            </span>
          </div>

          {/* New Diagnostic Session (Desktop shortcut) */}
          <button
            onClick={startNewSession}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 px-2.5 py-1.5 sm:px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-amber-500/50 hover:bg-slate-200 dark:hover:bg-slate-850 transition-all active:scale-95"
            title="Start new blank diagnostic session"
          >
            <Plus className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
            <span className="hidden md:inline">New Session</span>
          </button>

          {/* Lookup Booking by ID */}
          <button
            onClick={onOpenBookingLookup}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 px-2 py-1.5 sm:px-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-500/50 transition-all active:scale-95"
            title="Lookup existing booking reference"
          >
            <Search className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">Lookup</span>
          </button>

          {/* My Bookings Launcher */}
          <button
            onClick={() => setIsMyBookingsOpen(true)}
            className="relative flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 px-2.5 py-1.5 sm:px-3.5 text-xs font-bold text-slate-950 shadow-sm shadow-amber-500/15 hover:from-amber-400 hover:to-orange-400 transition-all active:scale-95"
            title="View scheduled appointments"
          >
            <Calendar className="h-3.5 w-3.5 stroke-[2.5]" />
            <span className="text-xs">Bookings</span>
            {bookings.length > 0 && (
              <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-slate-950 text-[9px] font-black text-amber-400">
                {bookings.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
