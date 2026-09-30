# 🚗 AutoTech AI - Virtual Automotive Diagnostic & Repair Platform (Frontend)

An enterprise-grade, senior-architected AI automotive troubleshooting and repair dispatch web application. AutoTech AI enables vehicle owners to diagnose mechanical, electrical, and powertrain issues using multimodal inputs (text, audio recordings, images, and video clips), generates certified technical diagnostic reports with cost estimates, and seamlessly schedules appointments with certified mechanic facilities.

---

## 🌟 Key Features

### 🎙️ 1. Multimodal Diagnostic Chat Interface
- **Microphone Audio Recording**: Built with Web Audio API and `MediaRecorder` with real-time waveform frequency visualizer bars to capture abnormal engine knocking, belt squeals, and exhaust rattles.
- **Visual & Video Telemetry**: Drag-and-drop or select photos of fluid leaks, tire wear, or dashboard warning lights and video clips for inspection.
- **Media Lightbox**: Full-resolution interactive image zoom, audio player with scrubber, and video playback with download capability.
- **Interactive Quick Symptom Chips**: Instant symptom presets for brakes, rough idles, overheating, and A/C failures.

### 📜 2. Persistent Diagnostic & Conversation History
- **History Sidebar**: Auto-syncs conversations to local session storage and backend API endpoints.
- **Live Search Filtering**: Search historical sessions by vehicle make/model, symptoms, or diagnostic issues.
- **Lifecycle Status Badges**: Visual indicators (`Live Session`, `Report Ready`, `Booked`).
- **Session Switching & Deletion**: Jump between previous car issues or start a new diagnostic session instantly.

### 🛠️ 3. Automotive HUD Diagnosis & "Book Mechanic" CTA
- **Certified Technical Diagnosis Card**: Identifies root issue, severity meter (`Low`, `Moderate`, `High`, `Critical`), estimated repair cost range, labor hours, and required parts breakdown.
- **Interactive Multi-Step Booking Flow**:
  1. **Facility Selection**: Choose from top-rated ASE certified repair facilities with distance and hourly rates.
  2. **Schedule**: Select preferred service date and morning/afternoon appointment windows.
  3. **Contact Info**: Customer name, phone, email, and special drop-off instructions.
  4. **Confirmation Ticket**: Generates a booking reference with a copy button.
- **"My Bookings" Drawer & Lookup**: Search appointment status by Booking ID or inspect local active bookings.

### 🚘 4. Dynamic Vehicle Specs & OBD-II Scanner
- **Vehicle Profile Selector**: Catalog of major vehicle makes, models, model years, and powertrain engines.
- **OBD-II Fault Code Database**: Searchable database of common trouble codes (`P0300`, `P0420`, `P0171`, `P0128`, `P0455`, `P0700`) with one-click insertion into the AI chat.

---

## 🏗️ Folder Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout with metadata and dark theme
│   ├── page.tsx                  # Home page with Provider and AppLayout
│   └── globals.css               # HUD styling, animations, custom scrollbars
├── context/
│   └── ChatContext.tsx           # Centralized single source of truth (zero re-render leakage)
├── hooks/
│   ├── useChat.ts                # Custom hook for chat state and actions
│   └── useAudioRecorder.ts       # MediaRecorder API & real-time waveform visualizer
├── components/
│   ├── chat/                     # ChatInterface, MessageList, MessageBubble, ChatInput, QuickPrompts
│   ├── diagnosis/                # DiagnosisCard (HUD assessment, parts list, CTA)
│   ├── booking/                  # BookingModal, BookingStatusModal, MyBookingsDrawer
│   ├── history/                  # HistorySidebar with search & session controls
│   ├── media/                    # AudioRecorder, MediaPreviewGrid, MediaLightboxModal
│   ├── vehicle/                  # VehicleSelector, OBDScannerModal
│   ├── ui/                       # Reusable ToastContainer, Modal, SeverityBadge
│   └── layout/                   # Header & AppLayout
├── services/
│   └── api.ts                    # Resilient typed API client with smart offline fallback simulator
├── lib/
│   ├── constants.ts              # Vehicle catalog, OBD-II dataset & mechanic partners
│   └── utils.ts                  # File validation, time formatters & localStorage helpers
└── types/
    └── index.ts                  # Strict TypeScript interfaces with 0 `any`
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18+ or v20+
- **npm** or **yarn** or **pnpm**

### Installation

1. Clone repository:
```bash
git clone https://github.com/ChetanSingh14/AI-Car-Mechanic-Chatbot-Frontend.git
cd AI-Car-Mechanic-Chatbot-Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure Environment Variables (Optional):
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
*(Note: If the backend is not running, AutoTech AI automatically switches to its built-in offline simulation engine so you can test all features smoothly).*

4. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

5. Build for production:
```bash
npm run build
npm run start
```

---

## 🛠️ Tech Stack
- **Framework**: Next.js (App Router, Turbopack)
- **Language**: TypeScript (Strict Typing)
- **Styling**: Tailwind CSS, Vanilla Glassmorphism
- **Icons**: Lucide React
- **Audio Processing**: Web Audio API & MediaRecorder
