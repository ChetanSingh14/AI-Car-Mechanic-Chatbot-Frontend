'use client';

import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { POPULAR_VEHICLE_MAKES, POPULAR_MODELS_BY_MAKE } from '../../lib/constants';
import { Car, ChevronDown, Check, Sparkles, Binary } from 'lucide-react';

export const VehicleSelector: React.FC = () => {
  const { vehicle, updateVehicle, setIsOBDModalOpen } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  const [make, setMake] = useState(vehicle.make || 'Honda');
  const [model, setModel] = useState(vehicle.model || 'Civic');
  const [year, setYear] = useState(vehicle.year || '2019');
  const [engine, setEngine] = useState(vehicle.engine || '1.5L Turbo');

  // Keep local state in sync when vehicle loads from storage
  React.useEffect(() => {
    if (!isOpen) {
      setMake(vehicle.make || 'Honda');
      setModel(vehicle.model || 'Civic');
      setYear(vehicle.year || '2019');
      setEngine(vehicle.engine || '1.5L Turbo');
    }
  }, [vehicle, isOpen]);

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

  return (
    <div className="relative z-20 rounded-2xl border border-slate-800/90 bg-slate-900/60 p-3 shadow-lg backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Active Vehicle Info Tag */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-amber-400 shadow-md">
            <Car className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Target Vehicle Specs
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.2 text-[10px] font-bold text-amber-400">
                <Sparkles className="h-2.5 w-2.5" /> Active Profile
              </span>
            </div>
            <p className="text-sm font-extrabold text-slate-100 mt-0.5">
              {vehicle.year} {vehicle.make} {vehicle.model}
              {vehicle.engine && <span className="text-xs font-normal text-slate-400 ml-1.5">• {vehicle.engine}</span>}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOBDModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-all"
            title="Search OBD-II Diagnostic Codes"
          >
            <Binary className="h-3.5 w-3.5" />
            <span>OBD-II Codes</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-500/50 hover:bg-slate-800 hover:text-white transition-all"
          >
            <span>{isOpen ? 'Close' : 'Change Car'}</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown Edit Form */}
      {isOpen && (
        <form
          onSubmit={handleSave}
          className="mt-3 grid grid-cols-1 gap-3 border-t border-slate-800/80 pt-3 sm:grid-cols-5 animate-in fade-in slide-in-from-top-2"
        >
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Make</label>
            <select
              value={make}
              onChange={(e) => handleMakeChange(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
            >
              {POPULAR_VEHICLE_MAKES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Model</label>
            {availableModels.length > 0 ? (
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Model Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
            >
              {yearsList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Engine / Powertrain</label>
            <input
              type="text"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              placeholder="e.g. 2.0L VTEC, Electric"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              <span>Save Specs</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
