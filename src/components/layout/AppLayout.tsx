'use client';

import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { Header } from './Header';
import { HistorySidebar } from '../history/HistorySidebar';
import { VehicleSelector } from '../vehicle/VehicleSelector';
import { ChatInterface } from '../chat/ChatInterface';
import { BookingModal } from '../booking/BookingModal';
import { BookingStatusModal } from '../booking/BookingStatusModal';
import { MyBookingsDrawer } from '../booking/MyBookingsDrawer';
import { MediaLightboxModal } from '../media/MediaLightboxModal';
import { OBDScannerModal } from '../vehicle/OBDScannerModal';
import { ToastContainer } from '../ui/ToastContainer';

export const AppLayout: React.FC = () => {
  const { theme } = useChat();
  const [bookingLookupOpen, setBookingLookupOpen] = useState(false);

  return (
    <div
      data-theme={theme}
      className={`relative flex h-[100dvh] flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-amber-500 selection:text-slate-950 overflow-hidden font-sans antialiased transition-colors duration-200 ${
        theme === 'dark' ? 'dark' : ''
      }`}
    >
      {/* Ambient background glow accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-amber-500/5 dark:bg-amber-500/8 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-orange-500/4 dark:bg-orange-600/6 blur-[140px]" />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-cyan-500/4 dark:bg-cyan-600/6 blur-[130px]" />
      </div>

      {/* Top Header */}
      <div className="relative z-30 shrink-0">
        <Header onOpenBookingLookup={() => setBookingLookupOpen(true)} />
      </div>

      {/* Main App Canvas */}
      <div className="relative z-10 flex flex-1 min-h-0 overflow-hidden">
        {/* Diagnostic History Sidebar */}
        <HistorySidebar />

        {/* Primary Diagnostic Workspace */}
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden p-2 sm:p-3 lg:p-4">
          <div className="mx-auto flex flex-col flex-1 min-h-0 w-full max-w-6xl gap-2 sm:gap-3">
            {/* Active Vehicle Specifications Bar */}
            <div className="shrink-0">
              <VehicleSelector />
            </div>

            {/* Chat & Multimodal Diagnostics Bay */}
            <div className="flex-1 min-h-0 flex flex-col">
              <ChatInterface />
            </div>
          </div>
        </main>
      </div>

      {/* Booking Form & Modal */}
      <BookingModal />

      {/* Booking Status Lookup Modal */}
      <BookingStatusModal
        isOpen={bookingLookupOpen}
        onClose={() => setBookingLookupOpen(false)}
      />

      {/* My Bookings Slide-over Drawer */}
      <MyBookingsDrawer />

      {/* Media Inspection Lightbox Modal */}
      <MediaLightboxModal />

      {/* OBD-II Fault Codes Modal */}
      <OBDScannerModal />

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};
