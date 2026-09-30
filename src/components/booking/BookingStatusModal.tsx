'use client';

import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { getBookingDetails } from '../../services/api';
import { Booking } from '../../types';
import {
  X,
  Search,
  Calendar,
  Wrench,
  AlertCircle,
  Loader2,
  Clock,
  User,
  Phone,
  DollarSign
} from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface BookingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingStatusModal: React.FC<BookingStatusModalProps> = ({ isOpen, onClose }) => {
  const { bookings } = useChat();
  const [searchId, setSearchId] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim();
    if (!query) return;

    const localMatch = bookings.find(
      (b) => b.id.toLowerCase() === query.toLowerCase()
    );
    if (localMatch) {
      setBooking(localMatch);
      setErrorMsg(null);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setBooking(null);

    const response = await getBookingDetails(query);
    setLoading(false);

    if (response.success && response.data) {
      setBooking(response.data);
    } else {
      setErrorMsg(response.error?.message || 'No booking found matching that reference ID.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 dark:bg-slate-950/80 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 text-slate-900 dark:text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-amber-500 mb-1">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">Lookup Mechanic Booking</h3>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-4">
          Enter your Booking ID reference to check live appointment and dispatch status.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Paste Booking Reference (e.g. BK-...)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:outline-none font-mono min-w-0"
          />
          <button
            type="submit"
            disabled={loading || !searchId.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 px-3.5 sm:px-4 py-2 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 transition-all shrink-0 active:scale-95 shadow-xs"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="hidden xs:inline">Search</span>
          </button>
        </form>

        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2 mb-4">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {booking && (
          <div className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 sm:p-4 space-y-2.5 text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Booking Ref</span>
                <p className="font-mono text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm">{booking.id}</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-bold capitalize text-emerald-600 dark:text-emerald-400 text-[10px]">
                {booking.status}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Customer:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{booking.customer_name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{booking.customer_phone}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Schedule:
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {booking.preferred_date} ({booking.preferred_time})
                </span>
              </div>

              {booking.service_type && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5" /> Service:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{booking.service_type}</span>
                </div>
              )}

              {booking.estimated_cost && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" /> Estimate:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{booking.estimated_cost}</span>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-2 text-right" suppressHydrationWarning>
              Booked on {formatDate(booking.created_at)}
            </div>
          </div>
        )}

        {/* Local Recent Bookings shortcuts if available */}
        {!booking && bookings.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-2">
              Recent Bookings on this Device:
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setBooking(b)}
                  className="cursor-pointer flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 p-2 text-xs hover:border-amber-500/40 transition-colors"
                >
                  <div>
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{b.id}</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{b.customer_name} • {b.preferred_date}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold capitalize">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
