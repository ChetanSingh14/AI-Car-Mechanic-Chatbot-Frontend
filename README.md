# 🚗 AutoTech AI - Virtual Automotive Diagnostic & Repair Platform (Frontend)

An enterprise-grade, senior-architected AI automotive troubleshooting and repair dispatch web application. AutoTech AI enables vehicle owners to diagnose mechanical, electrical, and powertrain issues using multimodal inputs (text, real-time audio waveform recordings, images, and video clips), generates certified technical diagnostic reports with cost estimates, and seamlessly schedules appointments with certified mechanic facilities.

---

## 🌟 Key Features

### ☀️ / 🌙 1. Dynamic Light & Dark Mode Engine
- **Instant Theme Toggle**: Switch seamlessly between **Deep Obsidian Dark Mode** and **Crisp High-Contrast Light Mode** with a single click in the header.
- **Tailwind CSS v4 Custom Variant**: Integrated `@custom-variant dark` mapping for robust class-based and data-attribute theme switching.
- **Local Preference Persistence**: Remembers your preferred mode (`autotech_theme_v2`) across sessions with automatic system color-scheme fallback.
- **Tailored Palettes**: Dark mode features amber glows and slate-950 obsidian glass; light mode delivers clean slate-50 surfaces with high-readability typography.

---

### 📱 2. All-Screen Adaptive Responsiveness (Mobile, Tablet, Desktop, Ultra-Wide)
- **Fluid `100dvh` Viewport**: Eliminates mobile browser address-bar jumping on iOS Safari and Android Chrome with zero nested scrollbar glitches.
- **Ultra-Compact Mobile Vehicle Bar**: Takes minimal vertical space on compact screens (~36px height) while providing full vehicle specs, OBD-II scanner launch, and expandable specs form.
- **Adaptive Diagnostic Symptoms Launchpad**: Responsive symptom chips (brakes, idle vibration, cooling, electrical, A/C, exhaust) that format cleanly on 320px–480px phones without pushing the chat input off screen.
- **Streamlined Mobile Multimodal Bar**: Adaptive input row where media attachments, microphone audio recorder, auto-growing textarea, and send button fit comfortably without horizontal overflow.
- **Mobile Slide-Over History Drawer**: Opens as a smooth backdrop-blurred slide-in drawer on mobile with a tap-friendly close button and auto-dismiss on session selection.
- **Responsive Modals**: All dialogs (Certified Booking Wizard, OBD-II Code Scanner, Booking Reference Lookup, Media Lightbox) utilize responsive constraints (`max-h-[90dvh]`) with internal scrolling.

---

### 🎙️ 3. Multimodal Diagnostic Chat Interface
- **Microphone Audio Waveform Recording**: Built with Web Audio API and `MediaRecorder` with real-time waveform visualizer bars to capture abnormal engine knocking, belt squeals, and exhaust rattles.
- **Visual & Video Telemetry**: Drag-and-drop or select photos of fluid leaks, tire wear, or dashboard warning lights and video clips for inspection.
- **Media Lightbox**: Full-resolution interactive image zoom, audio player with waveform telemetry, and video playback with download capability.
- **Deterministic & AI Generation Badges**: Clear visual tags identifying whether insights stem from deterministic diagnostic rules or multimodal AI models.

---

### 📜 4. Persistent Diagnostic & Conversation History
- **History Sidebar**: Auto-syncs conversations to local session storage and backend API endpoints.
- **Live Search Filtering**: Search historical sessions by vehicle make/model, symptoms, or diagnostic issues with instant clear actions.
- **Lifecycle Status Badges**: Visual indicators (`Active`, `Report Ready`, `Booked`).
- **Session Switching & Deletion**: Jump between previous car issues or start a new diagnostic session with one tap.

---

### 🛠️ 5. Automotive Diagnosis & "Book Mechanic" CTA
- **Certified Technical Diagnosis Card**: Identifies root issue, severity meter (`Low`, `Moderate`, `High`, `Critical`), estimated repair cost range, labor hours, required parts breakdown, and 12-Month / 12,000-Mile Warranty certification.
- **Interactive Multi-Step Booking Flow**:
  1. **Facility Selection**: Choose from top-rated ASE certified repair facilities with distance and hourly rates.
  2. **Schedule**: Select preferred service date and morning/afternoon appointment windows.
  3. **Contact Info**: Customer name, phone, email, and special drop-off instructions.
  4. **Confirmation Ticket**: Generates a booking reference with a copy button.
- **"My Bookings" Drawer & Lookup**: Search appointment status by Booking ID or inspect local active bookings.

---

### 🚘 6. Dynamic Vehicle Specs & OBD-II Scanner
- **Vehicle Profile Selector**: Catalog of major vehicle makes, models, model years, and powertrain engines.
- **OBD-II Fault Code Database**: Searchable database of common trouble codes (`P0300`, `P0420`, `P0171`, `P0128`, `P0455`, `P0700`) with one-click insertion into the AI chat.

### 🛡️ 7. Same-Origin Reverse Proxy & Mixed-Content Immunity
- **Next.js Server Proxy Engine**: Automatically routes API calls (`/api/backend/*`) and media files (`/media/*`) through a same-origin server bridge when deployed on HTTPS (e.g., Vercel).
- **Zero Mixed-Content Errors**: Enables full HTTPS frontend deployments to communicate with plain HTTP AWS EC2 backend servers seamlessly without browser security blocks.
- **Universal Media URL Normalizer**: Normalizes uploaded vehicle inspection photos, recorded audio waveforms, and video clips so they load via secure proxy routes.
- **Intelligent Offline Fallback Simulator**: If the remote backend is unreachable or offline, the frontend automatically switches to a local deterministic AI diagnosis engine without breaking the UI experience.

---

## 🏗️ Folder Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout with metadata and font configurations
│   ├── page.tsx                  # Home page with Provider and AppLayout
│   ├── globals.css               # Light/Dark design tokens, animations, custom scrollbars
│   ├── api/
│   │   └── backend/[...path]/    # Next.js API reverse proxy dispatcher
│   └── media/[...path]/          # Next.js Media reverse proxy (images, audio, video)
├── context/
│   └── ChatContext.tsx           # Centralized single source of truth & Theme state manager
├── hooks/
│   ├── useChat.ts                # Custom hook for chat state, actions & theme toggling
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
│   └── api.ts                    # Single source of truth: API client, media proxy engine & offline fallback
├── lib/
│   ├── constants.ts              # Vehicle catalog, OBD-II dataset & mechanic partners
│   └── utils.ts                  # File validation, time formatters, media URL normalizer & storage helpers
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

### 3. Configure Environment Variables (Optional):
Create a `.env.local` file:
```env
# Optional: Set custom backend URL (Defaults to local/cloud backend endpoint)
BACKEND_API_URL=http://localhost:8000/api
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

## ☁️ Deployment Guide

### Deploying to Vercel
1. Import the repository into [Vercel](https://vercel.com).
2. *(Optional)* Under **Project Settings ➔ Environment Variables**, configure:
   - `BACKEND_API_URL`: Your backend API endpoint URL (e.g. `http://your-backend-host/api`).
3. Deploy! Next.js will automatically proxy all API and media calls over HTTPS.

### Production Backend Media Permissions
To ensure uploaded images/media are readable by Nginx on your Linux production server:
```bash
sudo chmod -R 755 /path/to/backend/media
sudo chown -R ubuntu:www-data /path/to/backend/media
```


---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (Strict Typing)
- **Styling**: Tailwind CSS v4, Glassmorphism, Theme Variables
- **Icons**: Lucide React
- **Audio Processing**: Web Audio API & MediaRecorder

