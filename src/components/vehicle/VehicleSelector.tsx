'use client';

import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { POPULAR_VEHICLE_MAKES, POPULAR_MODELS_BY_MAKE } from '../../lib/constants';
import { Car, ChevronDown, Check, Sparkles, Binary, SlidersHorizontal } from 'lucide-react';

export const VehicleSelector: React.FC = () => {
  const { vehicle, updateVehicle, setIsOBDModalOpen } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  const [make, setMake] = useState(vehicle.make || 'Honda');
  const [model, setModel] = useState(vehicle.model || 'Civic');
  const [year, setYear] = useState(vehicle.year || '2019');
  const [engine, setEngine] = useState(vehicle.engine || '1.5L Turbo');

  const toggleDropdown = () => {
    if (!isOpen) {
      setMake(vehicle.make || 'Honda');
      setModel(vehicle.model || 'Civic');
      setYear(vehicle.year || '2019');
      setEngine(vehicle.engine || '1.5L Turbo');
    }
    setIsOpen(!isOpen);
  };

  const availableModels = POPULAR_MODELS_BY_MAKE[make] || [];

  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    const models = POPULAR_MODELS_BY_MAKE[newMake];
    if (models && models.length > 0) {
      setModel(models[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateVehicle({ make, model, year, engine });
    setIsOpen(false);
  };

  const yearsList = Array.from({ length: 30 }, (_, i) => (2026 - i).toString());

  const hasVehicleInfo = !!(vehicle.make || vehicle.model || vehicle.year);

  return (
    <div className="relative z-20 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/60 p-2 sm:p-3 shadow-sm dark:shadow-xl backdrop-blur-md transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* Active Vehicle Info Tag */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="flex h-7.5 w-7.5 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-slate-100 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700/80 text-amber-500 dark:text-amber-400 shadow-xs">
            <Car className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
          </div>

          <div className="min-w-0">
            <div className="hidden xs:flex items-center gap-1.5">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Target Vehicle
              </span>
              {hasVehicleInfo ? (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-bold text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-2 w-2" /> Selected
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-500/10 border border-slate-500/30 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-bold text-slate-500 dark:text-slate-400">
                  Auto-detecting in chat
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">
              {hasVehicleInfo ? (
                <>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                  {vehicle.engine && (
                    <span className="text-[10px] sm:text-xs font-normal text-slate-500 dark:text-slate-400 ml-1 hidden sm:inline">
                      • {vehicle.engine}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-slate-500 dark:text-slate-400 font-medium italic">
                  Not specified (Click edit or mention in chat)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsOBDModalOpen(true)}
            className="flex items-center gap-1 rounded-lg sm:rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition-all active:scale-95"
            title="Search OBD-II Diagnostic Codes"
          >
            <Binary className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="text-[11px]">OBD-II</span>
          </button>

          <button
            type="button"
            onClick={toggleDropdown}
            className="flex items-center gap-1 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/90 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-amber-500/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            <SlidersHorizontal className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500 dark:text-amber-400" />
            <span className="hidden xs:inline">{isOpen ? 'Close' : 'Edit'}</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown Edit Form */}
      {isOpen && (
        <form
          onSubmit={handleSave}
          className="mt-2.5 grid grid-cols-1 gap-2 border-t border-slate-200 dark:border-slate-800/80 pt-2.5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 animate-in fade-in slide-in-from-top-1 text-xs"
        >
          <div>
            <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">Make</label>
            <select
              value={make}
              onChange={(e) => handleMakeChange(e.target.value)}
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
            >
              {POPULAR_VEHICLE_MAKES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">Model</label>
            {availableModels.length > 0 ? (
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-lg sm:rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
              >
                {availableModels.map((mod) => (
                  <option key={mod} value={mod}>
                    {mod}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Model name"
                className="w-full rounded-lg sm:rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            )}
          </div>

          <div>
            <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
            >
              {yearsList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">Engine / Trim</label>
            <input
              type="text"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              placeholder="e.g. 1.5L Turbo, Electric"
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-4 xl:col-span-1">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-sm transition-all active:scale-95"
            >
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              <span>Save Vehicle</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
