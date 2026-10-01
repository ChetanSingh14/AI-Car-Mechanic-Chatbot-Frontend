# 🚗 AutoTech AI — Virtual Automotive Diagnostic & Repair Platform (Frontend)

A modern Next.js automotive troubleshooting and repair dispatch web application. AutoTech AI enables vehicle owners to troubleshoot mechanical, electrical, and powertrain issues using multimodal inputs (text, audio recordings, images, video clips), generates technical diagnostic reports with cost estimates, and schedules appointments with certified mechanic facilities.

---

## 🔗 Live Links
- **[Live Frontend Application](https://ai-car-mechanic-chatbot-frontend.vercel.app)**
- **[Backend API Base](http://13.234.4.236/api/)**
- **[Interactive API Docs (Swagger UI)](http://13.234.4.236/api/docs/)**
- **[OpenAPI Schema (JSON)](http://13.234.4.236/api/schema/)**
- **[ReDoc Documentation](http://13.234.4.236/api/redoc/)**
- **[Health Check Endpoint](http://13.234.4.236/api/health/)**

---

## 🌟 Key Features

### ☀️ / 🌙 1. Light & Dark Mode
- **Instant Theme Toggle**: Switch seamlessly between Dark Mode and High-Contrast Light Mode with a single click in the header.
- **Tailwind CSS v4 Integration**: Class-based and data-attribute theme switching.
- **Local Preference Persistence**: Remembers your preferred mode across browser sessions.

---

### 📱 2. Adaptive Responsiveness
- **Fluid Viewport**: Optimized layout across mobile phones, tablets, and desktop displays.
- **Compact Vehicle Bar**: Quick vehicle specs selector and OBD-II scanner launch.
- **Adaptive Diagnostic Symptoms Launchpad**: One-click symptom chips (brakes, idle vibration, cooling, electrical, A/C, exhaust).
- **Streamlined Multimodal Input Bar**: Media attachments, microphone audio recorder, auto-growing textarea, and send button.
- **Mobile Slide-Over History Drawer**: Backdrop-blurred slide-in drawer for session history.

---

### 🎙️ 3. Multimodal Diagnostic Chat Interface
- **Microphone Audio Waveform Recording**: Built with Web Audio API and `MediaRecorder` with real-time waveform visualizer to capture engine knocks, belt squeals, and exhaust rattles.
- **Visual & Video Telemetry**: Upload photos of fluid leaks, tire wear, or dashboard warning lights and video clips (up to 4 MB).
- **Media Lightbox**: Full-resolution interactive image preview, audio playback, and video inspection.
- **Deterministic & AI Generation Badges**: Clear visual tags identifying whether insights stem from deterministic diagnostic rules or multimodal AI models.

---

### 📜 4. Privacy-Isolated Diagnostic History
- **Client Session Privacy (`X-Client-Token`)**: Automatically generates an anonymous client token in `localStorage`, sent on all API requests to ensure users only access and manage their own chat history and bookings.
- **History Sidebar**: Auto-syncs conversations with the backend API.
- **Live Search Filtering**: Search historical sessions by vehicle make/model or symptoms.
- **Session Management**: Switch between previous diagnostic sessions or delete individual sessions securely.

---

### 🛠️ 5. Automotive Diagnosis & "Book Mechanic" CTA
- **Technical Diagnosis Card**: Identifies root issue, severity rating (*Low*, *Medium*, *High*, *Critical*), estimated repair cost range, labor hours, and required parts breakdown.
- **Multi-Step Booking Flow**:
  1. **Facility Selection**: Choose from ASE certified repair facilities.
  2. **Schedule**: Select preferred service date and morning/afternoon appointment windows.
  3. **Contact Info**: Customer name, phone, email, and special drop-off instructions.
  4. **Confirmation Ticket**: Generates a booking reference with a copy button.
- **"My Bookings" Drawer & Lookup**: Search appointment status by Booking ID or inspect active user bookings.

---

### 🚘 6. Dynamic Vehicle Specs & OBD-II Scanner
- **Vehicle Profile Selector**: Catalog of major vehicle makes, models, model years, and powertrain engines.
- **OBD-II Fault Code Database**: Searchable database of common trouble codes (`P0300`, `P0420`, `P0171`, `P0128`, `P0455`, `P0700`) with one-click insertion into the chat.

---

### 🛡️ 7. Same-Origin Reverse Proxy & Mixed-Content Immunity
- **Next.js Server Proxy Engine**: Automatically routes API calls (`/api/backend/*`) and media files (`/media/*`) through a same-origin server bridge when deployed on HTTPS (e.g., Vercel).
- **Zero Mixed-Content Errors**: Enables HTTPS frontend deployments to communicate with plain HTTP AWS EC2 backend servers seamlessly without browser security blocks.
- **Universal Media URL Normalizer**: Normalizes uploaded vehicle inspection photos, recorded audio waveforms, and video clips so they load via secure proxy routes.
- **Offline Fallback Simulator**: If the remote backend is unreachable, the frontend falls back gracefully with clear diagnostic messages.

---

## 🏗️ Folder Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with metadata and font configurations
│   │   ├── page.tsx                  # Home page with Provider and AppLayout
│   │   ├── globals.css               # Light/Dark design tokens, animations, custom scrollbars
│   │   ├── api/
│   │   │   └── backend/[...path]/    # Next.js API reverse proxy dispatcher
│   │   └── media/[...path]/          # Next.js Media reverse proxy (images, audio, video)
│   ├── context/
│   │   └── ChatContext.tsx           # Chat context & theme state manager
│   ├── hooks/
│   │   ├── useChat.ts                # Custom hook for chat state and actions
│   │   └── useAudioRecorder.ts       # MediaRecorder API & waveform visualizer
│   ├── components/
│   │   ├── chat/                     # ChatInterface, MessageList, MessageBubble, ChatInput, QuickPrompts
│   │   ├── diagnosis/                # DiagnosisCard (assessment, parts list, booking CTA)
│   │   ├── booking/                  # BookingModal, BookingStatusModal, MyBookingsDrawer
│   │   ├── history/                  # HistorySidebar with search & session controls
│   │   ├── media/                    # AudioRecorder, MediaPreviewGrid, MediaLightboxModal
│   │   ├── vehicle/                  # VehicleSelector, OBDScannerModal
│   │   ├── ui/                       # Reusable ToastContainer, Modal, SeverityBadge
│   │   └── layout/                   # Header & AppLayout
│   ├── services/
│   │   └── api.ts                    # API client, client token handling, media proxy & error normalizer
│   ├── lib/
│   │   ├── constants.ts              # Vehicle catalog, OBD-II dataset & mechanic partners
│   │   └── utils.ts                  # File validation (4 MB limit), formatters & helpers
│   └── types/
│       └── index.ts                  # TypeScript interfaces
├── .env.example
├── package.json
└── README.md
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

3. Environment Configuration (Optional for local development):
```bash
cp .env.example .env.local
```
For local development, the application defaults to `http://localhost:8000/api` automatically.

4. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Build for production:
```bash
npm run build
npm run start
```

---

## ☁️ Deployment Guide

### Deploying to Vercel
1. Import the repository into [Vercel](https://vercel.com).
2. Under **Project Settings ➔ Environment Variables**, configure:
   - `BACKEND_API_URL`: `http://<your-ec2-ip-or-domain>/api`
   - `NEXT_PUBLIC_API_URL`: `http://<your-ec2-ip-or-domain>/api`
3. Click **Deploy**. Next.js server proxy handlers route client API requests to the backend server-to-server.

---

## 🛠️ Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Glassmorphism, Theme Variables
- **Icons**: Lucide React
- **Audio Processing**: Web Audio API & MediaRecorder

---

## 📄 License
This project is licensed under the MIT License.
