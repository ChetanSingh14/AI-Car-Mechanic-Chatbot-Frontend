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

  // Step 1: Select Mechanic Partner & Service Option
  // Step 2: Date & Time Schedule
  // Step 3: Contact & Vehicle Details
  // Step 4: Confirmed Receipt Ticket
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
    // Reset back to step 1 for next open
    setTimeout(() => {
      setStep(1);
      setConfirmedBooking(null);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/80 backdrop-blur-xl animate-in zoom-in-95">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Wrench className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Schedule Certified Mechanic Repair</h3>
              <p className="text-[11px] text-slate-400">
                {vehicle.year} {vehicle.make} {vehicle.model} • {currentDiag.recommended_service}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        {step !== 4 && (
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/20 px-6 py-2.5 text-xs font-semibold">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-400' : 'text-slate-500'}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step >= 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                1
              </span>
              <span>Shop & Tech</span>
            </div>

            <div className="h-px w-6 bg-slate-800" />

            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-400' : 'text-slate-500'}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step >= 2 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                2
              </span>
              <span>Time Slot</span>
            </div>

            <div className="h-px w-6 bg-slate-800" />

            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-amber-400' : 'text-slate-500'}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step >= 3 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                3
              </span>
              <span>Contact</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Select Mechanic */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Diagnosis Summary</span>
                  <p className="font-bold text-slate-100 text-sm">{currentDiag.issue_title}</p>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">Est. {currentDiag.estimated_cost}</p>
                </div>
                <SeverityBadge severity={currentDiag.severity} size="sm" />
              </div>

              <span className="block text-xs font-semibold text-slate-300">
                Select Certified Automotive Facility:
              </span>

              <div className="space-y-2.5">
                {CERTIFIED_MECHANIC_PARTNERS.map((partner) => {
                  const isSelected = partner.id === selectedMechanicId;
                  return (
                    <div
                      key={partner.id}
                      onClick={() => setSelectedMechanicId(partner.id)}
                      className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-100 text-sm">{partner.name}</h4>
                            {partner.is_certified && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-bold text-emerald-400">
                                <ShieldCheck className="h-3 w-3" /> Certified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                            <span className="flex items-center gap-1 text-amber-400 font-semibold">
                              <Star className="h-3 w-3 fill-amber-400" />
                              {partner.rating} ({partner.reviews_count} reviews)
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {partner.distance}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-slate-200">
                            {partner.hourly_rate}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {partner.specialties.map((spec, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300"
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
                  className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Select Date & Time</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Schedule Date & Time */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Selected Facility</span>
                  <p className="font-bold text-slate-100 text-sm">{selectedMechanic.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Service Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Appointment Window
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Special Instructions / Drop-off Notes (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <textarea
                    rows={3}
                    placeholder="e.g. Loaner car request, key in lockbox, noise only occurs when cold in the morning..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Customer Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Customer Information & Submission */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="(555) 234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Facility:</span>
                  <span className="font-semibold text-slate-200">{selectedMechanic.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Appointment:</span>
                  <span className="font-semibold text-slate-200">
                    {date} @ {time}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2">
                  <span>Estimated Total:</span>
                  <span className="font-bold text-emerald-400 font-mono">{currentDiag.estimated_cost}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !name || !email || !phone}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                  )}
                  <span>Confirm & Lock Appointment</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Confirmed Receipt Ticket */}
          {step === 4 && confirmedBooking && (
            <div className="text-center py-2 space-y-4 animate-in zoom-in-95">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10 animate-bounce">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-100">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Your certified mechanic booking has been registered in the repair dispatch system.
                </p>
              </div>

              {/* Digital Repair Ticket */}
              <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-4 text-left space-y-2.5 text-xs shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Booking Reference</span>
                    <p className="font-mono text-amber-400 font-bold text-sm">{confirmedBooking.id}</p>
                  </div>
                  <button
                    onClick={handleCopyBookingId}
                    className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] font-semibold text-slate-300 hover:text-white"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-400">
                  <div>
                    <span className="text-[10px] text-slate-500">Customer:</span>
                    <p className="font-semibold text-slate-200">{confirmedBooking.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Facility:</span>
                    <p className="font-semibold text-slate-200">{confirmedBooking.mechanic_name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Schedule:</span>
                    <p className="font-semibold text-slate-200">
                      {confirmedBooking.preferred_date} @ {confirmedBooking.preferred_time}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Status:</span>
                    <p className="font-bold text-emerald-400 capitalize">{confirmedBooking.status}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
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
