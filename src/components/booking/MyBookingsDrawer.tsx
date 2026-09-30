'use client';

import React from 'react';
import { useChat } from '../../hooks/useChat';
import { X, Calendar, Wrench, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export const MyBookingsDrawer: React.FC = () => {
  const { isMyBookingsOpen, setIsMyBookingsOpen, bookings } = useChat();

  if (!isMyBookingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={() => setIsMyBookingsOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl shadow-black/80 flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/40">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-base">My Booked Appointments</h3>
                <p className="text-[11px] text-slate-400">
                  {bookings.length} scheduled repair {bookings.length === 1 ? 'service' : 'services'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMyBookingsOpen(false)}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-500">
                  <Wrench className="h-7 w-7" />
                </div>
                <h4 className="font-bold text-slate-300 text-sm">No Appointments Yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Diagnose your vehicle symptoms in the chat workspace, then schedule an appointment with a certified partner.
                </p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3 shadow-md transition-all hover:border-amber-500/40"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Booking ID</span>
                      <p className="font-mono text-amber-400 font-bold text-xs">{booking.id}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                      <CheckCircle2 className="h-3 w-3" />
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-300 font-semibold">
                      <Wrench className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{booking.service_type || 'Diagnostic Repair'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-200">{booking.preferred_date} @ {booking.preferred_time}</span>
                    </div>

                    {booking.mechanic_name && (
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{booking.mechanic_name}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-900">
                      <span>Customer: {booking.customer_name}</span>
                      {booking.estimated_cost && (
                        <span className="font-mono text-emerald-400 font-bold">{booking.estimated_cost}</span>
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
