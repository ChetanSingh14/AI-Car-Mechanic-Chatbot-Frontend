'use client';

import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { CERTIFIED_MECHANIC_PARTNERS } from '../../lib/constants';
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  Loader2,
  Wrench,
  Star,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react';
import { SeverityBadge } from '../ui/Badge';
import { Booking } from '../../types';

export const BookingModal: React.FC = () => {
  const {
    bookingModalOpen,
    closeBookingModal,
    activeBookingDiagnosis,
    diagnosis,
    vehicle,
    createNewBooking
  } = useChat();

  const currentDiag = activeBookingDiagnosis || diagnosis;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedMechanicId, setSelectedMechanicId] = useState(CERTIFIED_MECHANIC_PARTNERS[0].id);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('09:00 AM - 11:00 AM');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);

  if (!bookingModalOpen || !currentDiag) return null;

  const selectedMechanic =
    CERTIFIED_MECHANIC_PARTNERS.find((m) => m.id === selectedMechanicId) ||
    CERTIFIED_MECHANIC_PARTNERS[0];

  const handleNext = () => {
    if (step < 3) setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingResult = await createNewBooking({
      name,
      email,
      phone,
      date,
      time,
      notes,
      mechanicId: selectedMechanic.id,
      mechanicName: selectedMechanic.name
    });

    setIsSubmitting(false);

    if (bookingResult) {
      setConfirmedBooking(bookingResult);
      setStep(4);
    }
  };

  const handleCopyBookingId = () => {
    if (confirmedBooking) {
      navigator.clipboard.writeText(confirmedBooking.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    closeBookingModal();
    setTimeout(() => {
      setStep(1);
      setConfirmedBooking(null);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 dark:bg-slate-950/85 p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92dvh] flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 text-slate-900 dark:text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3 sm:px-6 sm:py-3.5 bg-slate-50 dark:bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
              <Wrench className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base truncate">
                Schedule Mechanic Repair
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {vehicle.year} {vehicle.make} {vehicle.model} • {currentDiag.recommended_service}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100 transition-colors shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        {step !== 4 && (
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 px-4 py-2 sm:px-6 sm:py-2.5 text-xs font-semibold shrink-0">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>
              <span className={`flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full text-[10px] ${step >= 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                1
              </span>
              <span className="text-[11px] sm:text-xs">Shop & Tech</span>
            </div>

            <div className="h-px flex-1 mx-2 bg-slate-200 dark:bg-slate-800" />

            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>
              <span className={`flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full text-[10px] ${step >= 2 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                2
              </span>
              <span className="text-[11px] sm:text-xs">Time Slot</span>
            </div>

            <div className="h-px flex-1 mx-2 bg-slate-200 dark:bg-slate-800" />

            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>
              <span className={`flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full text-[10px] ${step >= 3 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                3
              </span>
              <span className="text-[11px] sm:text-xs">Contact</span>
            </div>
          </div>
        )}

        {/* Modal Body with smooth scrolling */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 text-xs">
          {/* STEP 1: Select Mechanic */}
          {step === 1 && (
            <div className="space-y-3.5 sm:space-y-4">
              <div className="rounded-xl sm:rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5 p-3 sm:p-3.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">Diagnosis Summary</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate">{currentDiag.issue_title}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Est. {currentDiag.estimated_cost}</p>
                </div>
                <div className="shrink-0">
                  <SeverityBadge severity={currentDiag.severity} size="sm" />
                </div>
              </div>

              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Certified Automotive Facility:
              </span>

              <div className="space-y-2">
                {CERTIFIED_MECHANIC_PARTNERS.map((partner) => {
                  const isSelected = partner.id === selectedMechanicId;
                  return (
                    <div
                      key={partner.id}
                      onClick={() => setSelectedMechanicId(partner.id)}
                      className={`cursor-pointer rounded-xl sm:rounded-2xl border p-3 transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{partner.name}</h4>
                            {partner.is_certified && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                                <ShieldCheck className="h-2.5 w-2.5" /> Certified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-semibold">
                              <Star className="h-3 w-3 fill-amber-400" />
                              {partner.rating} ({partner.reviews_count})
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {partner.distance}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-200">
                            {partner.hourly_rate}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {partner.specialties.map((spec, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-slate-200/80 dark:bg-slate-800/80 px-2 py-0.5 text-[9px] text-slate-700 dark:text-slate-300"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-orange-400 transition-all hover:scale-105 active:scale-95 shadow-md"
                >
                  <span>Select Date & Time</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Schedule Date & Time */}
          {step === 2 && (
            <div className="space-y-3.5 sm:space-y-4">
              <div className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">Selected Facility</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate">{selectedMechanic.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Service Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Appointment Window
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM (Early Drop-off)</option>
                      <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Morning Slot)</option>
                      <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM (Afternoon Slot)</option>
                      <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM (Late Slot)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Special Instructions / Drop-off Notes (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <textarea
                    rows={3}
                    placeholder="e.g. Loaner car request, key in lockbox, noise only occurs in morning..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-800 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-orange-400 transition-all hover:scale-105 active:scale-95 shadow-md"
                >
                  <span>Customer Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Customer Information & Submission */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="(555) 234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-3 sm:p-3.5 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600 dark:text-slate-400 gap-2">
                  <span>Facility:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200 truncate">{selectedMechanic.name}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 gap-2">
                  <span>Appointment:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {date} @ {time}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-1.5">
                  <span>Estimated Total:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{currentDiag.estimated_cost}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-800 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !name || !email || !phone}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 px-5 sm:px-6 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                  )}
                  <span>Confirm & Lock Slot</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Confirmed Receipt Ticket */}
          {step === 4 && confirmedBooking && (
            <div className="text-center py-2 space-y-3 animate-in zoom-in-95">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 shadow-md shadow-emerald-500/10 animate-bounce">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm mx-auto">
                  Your certified mechanic booking has been registered in the repair dispatch system.
                </p>
              </div>

              {/* Digital Repair Ticket */}
              <div className="rounded-xl sm:rounded-2xl border border-amber-500/30 bg-slate-50 dark:bg-slate-950 p-3.5 text-left space-y-2 text-xs shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Booking Ref</span>
                    <p className="font-mono text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm">{confirmedBooking.id}</p>
                  </div>
                  <button
                    onClick={handleCopyBookingId}
                    className="flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="text-[10px] text-slate-400">Customer:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{confirmedBooking.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Facility:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{confirmedBooking.mechanic_name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Schedule:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {confirmedBooking.preferred_date} @ {confirmedBooking.preferred_time}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Status:</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 capitalize">{confirmedBooking.status}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full rounded-xl bg-slate-200 dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Return to Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
