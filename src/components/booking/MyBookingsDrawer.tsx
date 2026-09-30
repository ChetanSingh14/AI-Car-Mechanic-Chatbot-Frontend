'use client';

import React from 'react';
import { useChat } from '../../hooks/useChat';
import { X, Calendar, Wrench, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export const MyBookingsDrawer: React.FC = () => {
  const { isMyBookingsOpen, setIsMyBookingsOpen, bookings } = useChat();

  if (!isMyBookingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={() => setIsMyBookingsOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-slate-900 dark:text-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 dark:bg-slate-950/40 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">My Appointments</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                  {bookings.length} scheduled repair {bookings.length === 1 ? 'service' : 'services'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMyBookingsOpen(false)}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {bookings.length === 0 ? (
              <div className="text-center py-12 space-y-2.5">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500">
                  <Wrench className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-300 text-sm">No Appointments Yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Diagnose your vehicle symptoms in the chat workspace, then schedule an appointment with a certified partner.
                </p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 p-3 sm:p-4 space-y-2 shadow-xs transition-all hover:border-amber-500/40"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <div>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Booking ID</span>
                      <p className="font-mono text-amber-600 dark:text-amber-400 font-bold text-xs">{booking.id}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.2 text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300 font-semibold">
                      <Wrench className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                      <span className="truncate">{booking.service_type || 'Diagnostic Repair'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-200">{booking.preferred_date} @ {booking.preferred_time}</span>
                    </div>

                    {booking.mechanic_name && (
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{booking.mechanic_name}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-900">
                      <span>Customer: {booking.customer_name}</span>
                      {booking.estimated_cost && (
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{booking.estimated_cost}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
