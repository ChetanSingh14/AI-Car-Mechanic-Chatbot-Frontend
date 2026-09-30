'use client';

import React, { useState } from 'react';
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
  const [bookingLookupOpen, setBookingLookupOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 overflow-hidden font-sans antialiased">
      {/* Top Header */}
      <Header onOpenBookingLookup={() => setBookingLookupOpen(true)} />

      {/* Main App Canvas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Diagnostic History Sidebar */}
        <HistorySidebar />

        {/* Primary Diagnostic Workspace */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5">
          <div className="mx-auto max-w-5xl space-y-3.5">
            {/* Active Vehicle Specifications Bar */}
            <VehicleSelector />

            {/* Chat & Multimodal Diagnostics Bay */}
            <ChatInterface />
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
