'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Conversation,
  Diagnosis,
  MediaAttachment,
  Message,
  VehicleInfo,
  Booking,
  ToastNotification,
  OBDCode
} from '../types';
import {
  sendChatMessage,
  uploadMedia,
  generateDiagnosis,
  createBooking,
  checkBackendHealth
} from '../services/api';
import { generateId, safeLocalStorageGet, safeLocalStorageSet } from '../lib/utils';

interface ChatContextType {
  // Active Conversation State
  conversationId: string | null;
  messages: Message[];
  mediaAttachments: MediaAttachment[];
  diagnosis: Diagnosis | null;
  isLoading: boolean;
  isUploading: boolean;
  isDiagnosing: boolean;
  error: string | null;

  // Vehicle
  vehicle: VehicleInfo;
  updateVehicle: (info: Partial<VehicleInfo>) => void;

  // Actions
  sendMessage: (text: string) => Promise<void>;
  uploadFile: (file: File) => Promise<MediaAttachment | null>;
  removeAttachment: (id: string) => void;
  triggerDiagnosis: () => Promise<void>;
  startNewSession: () => void;
  loadSession: (convId: string) => void;
  deleteSession: (convId: string) => void;

  // History
  conversationsHistory: Conversation[];
  activeSessionStatus: 'active' | 'diagnosed' | 'booked';

  // Bookings
  bookings: Booking[];
  bookingModalOpen: boolean;
  activeBookingDiagnosis: Diagnosis | null;
  openBookingModal: (diag?: Diagnosis) => void;
  closeBookingModal: () => void;
  createNewBooking: (params: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    notes?: string;
    mechanicId?: string;
    mechanicName?: string;
  }) => Promise<Booking | null>;
  isMyBookingsOpen: boolean;
  setIsMyBookingsOpen: (open: boolean) => void;

  // Media Lightbox
  activeLightboxMedia: MediaAttachment | null;
  openLightbox: (media: MediaAttachment) => void;
  closeLightbox: () => void;

  // OBD Modal
  isOBDModalOpen: boolean;
  setIsOBDModalOpen: (open: boolean) => void;
  insertOBDCode: (obd: OBDCode) => void;

  // Toasts
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;

  // Connectivity & Sidebar
  isBackendConnected: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const INITIAL_WELCOME_MESSAGE: Message = {
  id: 'welcome-initial',
  conversation: '',
  sender: 'assistant',
  content: `👋 **Welcome to AutoTech AI Master Diagnostics!**\n\nI am your virtual ASE-Certified Master Automobile Technician. I can inspect and diagnose mechanical, electrical, brake, engine, and transmission issues.\n\n🛠️ **How to get started:**\n- Describe what sounds, warning lights, or handling issues you are experiencing.\n- **Upload photos, record audio/video** of the abnormal noise or engine bay.\n- Click **"Generate Diagnosis"** at any time for certified repair quotes & mechanic booking.`,
  is_ai_generated: true,
  created_at: '2025-01-01T00:00:00.000Z'
};

const DEFAULT_VEHICLE: VehicleInfo = {
  make: 'Honda',
  model: 'Civic',
  year: '2019',
  mileage: '45,000 miles',
  engine: '1.5L Turbo'
};

const STORAGE_KEYS = {
  CONVERSATIONS: 'autotech_conversations_v2',
  ACTIVE_ID: 'autotech_active_id_v2',
  VEHICLE: 'autotech_vehicle_v2',
  BOOKINGS: 'autotech_bookings_v2'
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Vehicle state - default for initial render to ensure matching SSR/client HTML
  const [vehicle, setVehicle] = useState<VehicleInfo>(DEFAULT_VEHICLE);

  // Active chat state
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE]);
  const [mediaAttachments, setMediaAttachments] = useState<MediaAttachment[]>([]);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);

  // Async loadings
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // History & Bookings initialized with [] for SSR matching, populated in useEffect
  const [conversationsHistory, setConversationsHistory] = useState<Conversation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Modals & UI controls
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeBookingDiagnosis, setActiveBookingDiagnosis] = useState<Diagnosis | null>(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [activeLightboxMedia, setActiveLightboxMedia] = useState<MediaAttachment | null>(null);
  const [isOBDModalOpen, setIsOBDModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(true);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Stable Toast helper
  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = generateId('toast');
    const newToast: ToastNotification = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load saved state from localStorage after initial client hydration
  useEffect(() => {
    const savedVehicle = safeLocalStorageGet<VehicleInfo>(STORAGE_KEYS.VEHICLE, DEFAULT_VEHICLE);
    const savedHistory = safeLocalStorageGet<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
    const savedBookings = safeLocalStorageGet<Booking[]>(STORAGE_KEYS.BOOKINGS, []);

    setVehicle(savedVehicle);
    setConversationsHistory(savedHistory);
    setBookings(savedBookings);
  }, []);

  // Check Backend Connectivity on mount
  useEffect(() => {
    let mounted = true;
    checkBackendHealth().then((connected) => {
      if (mounted) setIsBackendConnected(connected);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Save vehicle changes to storage
  const updateVehicle = useCallback((info: Partial<VehicleInfo>) => {
    setVehicle((prev) => {
      const updated = { ...prev, ...info };
      safeLocalStorageSet(STORAGE_KEYS.VEHICLE, updated);
      return updated;
    });
  }, []);

  // Save active conversation state into the conversationsHistory list and localStorage
  const syncActiveConversationToHistory = useCallback(
    (
      convId: string,
      currentMessages: Message[],
      currentMedia: MediaAttachment[],
      currentDiag: Diagnosis | null,
      customStatus?: 'active' | 'diagnosed' | 'booked'
    ) => {
      if (!convId) return;

      const firstUserMsg = currentMessages.find((m) => m.sender === 'user');
      const title = firstUserMsg
        ? firstUserMsg.content.slice(0, 45) + (firstUserMsg.content.length > 45 ? '...' : '')
        : 'Diagnostic Session';

      const status = customStatus || (currentDiag ? 'diagnosed' : 'active');

      setConversationsHistory((prev) => {
        const existingIdx = prev.findIndex((c) => c.id === convId);
        const updatedConv: Conversation = {
          id: convId,
          car_make: vehicle.make,
          car_model: vehicle.model,
          car_year: vehicle.year,
          title: title,
          status: status,
          messages: currentMessages,
          media_attachments: currentMedia,
          diagnosis: currentDiag || undefined,
          created_at: existingIdx >= 0 ? prev[existingIdx].created_at : new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        let newHistory: Conversation[];
        if (existingIdx >= 0) {
          newHistory = [...prev];
          newHistory[existingIdx] = updatedConv;
        } else {
          newHistory = [updatedConv, ...prev];
        }

        safeLocalStorageSet(STORAGE_KEYS.CONVERSATIONS, newHistory);
        return newHistory;
      });
    },
    [vehicle]
  );

  // Send Chat Message
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const currentConvId = conversationId || generateId('conv');
      if (!conversationId) {
        setConversationId(currentConvId);
      }

      const tempUserMsg: Message = {
        id: generateId('msg-user-temp'),
        conversation: currentConvId,
        sender: 'user',
        content: trimmed,
        is_ai_generated: false,
        created_at: new Date().toISOString(),
        media_attachments: [...mediaAttachments]
      };

      const updatedMessages = [...messages, tempUserMsg];
      setMessages(updatedMessages);
      setIsLoading(true);
      setError(null);

      const response = await sendChatMessage({
        conversation_id: currentConvId,
        message: trimmed,
        car_make: vehicle.make,
        car_model: vehicle.model,
        car_year: vehicle.year,
        media_attachment_ids: mediaAttachments.map((m) => m.id)
      });

      setIsLoading(false);

      if (response.success && response.data) {
        const finalMessages = [
          ...updatedMessages.filter((m) => m.id !== tempUserMsg.id),
          response.data.user_message,
          response.data.assistant_message
        ];
        setMessages(finalMessages);
        syncActiveConversationToHistory(currentConvId, finalMessages, mediaAttachments, diagnosis);
      } else {
        const errMsg = response.error?.message || 'Failed to communicate with diagnostic server.';
        setError(errMsg);
        addToast({
          type: 'error',
          title: 'Message Delivery Failed',
          message: errMsg
        });
      }
    },
    [conversationId, isLoading, mediaAttachments, messages, vehicle, diagnosis, syncActiveConversationToHistory, addToast]
  );

  // Upload Media
  const uploadFile = useCallback(
    async (file: File): Promise<MediaAttachment | null> => {
      let currentConvId = conversationId;
      if (!currentConvId) {
        currentConvId = generateId('conv');
        setConversationId(currentConvId);
      }

      setIsUploading(true);
      setError(null);

      const response = await uploadMedia(currentConvId, file);
      setIsUploading(false);

      if (response.success && response.data) {
        const newAttachment = response.data;
        const newAttachments = [...mediaAttachments, newAttachment];
        setMediaAttachments(newAttachments);

        // System notification message
        const sysMsg: Message = {
          id: generateId('sys-msg'),
          conversation: currentConvId,
          sender: 'system',
          content: `📎 Attached diagnostic ${newAttachment.file_type.toUpperCase()}: ${newAttachment.original_name}`,
          is_ai_generated: false,
          created_at: new Date().toISOString()
        };

        const newMessages = [...messages, sysMsg];
        setMessages(newMessages);

        syncActiveConversationToHistory(currentConvId, newMessages, newAttachments, diagnosis);

        addToast({
          type: 'success',
          title: 'Media Attached',
          message: `${file.name} uploaded and queued for visual/audio analysis.`
        });

        return newAttachment;
      } else {
        const errMsg = response.error?.message || 'Failed to upload media attachment.';
        setError(errMsg);
        addToast({
          type: 'error',
          title: 'Upload Failed',
          message: errMsg
        });
        return null;
      }
    },
    [conversationId, mediaAttachments, messages, diagnosis, syncActiveConversationToHistory, addToast]
  );

  const removeAttachment = useCallback((id: string) => {
    setMediaAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Trigger Diagnosis
  const triggerDiagnosis = useCallback(async () => {
    if (messages.length < 2) {
      addToast({
        type: 'warning',
        title: 'More Context Needed',
        message: 'Please describe the car symptoms first before generating a technical diagnosis.'
      });
      return;
    }

    const currentConvId = conversationId || generateId('conv');
    if (!conversationId) setConversationId(currentConvId);

    setIsDiagnosing(true);
    setError(null);

    const userMessagesText = messages
      .filter((m) => m.sender === 'user')
      .map((m) => m.content)
      .join(' | ');

    const vehString = `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.engine || ''})`;

    const response = await generateDiagnosis(currentConvId, userMessagesText, vehString);
    setIsDiagnosing(false);

    if (response.success && response.data) {
      const diag = response.data;
      setDiagnosis(diag);

      syncActiveConversationToHistory(currentConvId, messages, mediaAttachments, diag, 'diagnosed');

      addToast({
        type: 'success',
        title: 'Diagnosis Report Ready!',
        message: `Identified: ${diag.issue_title} (${diag.severity.toUpperCase()})`
      });
    } else {
      const errMsg = response.error?.message || 'Failed to generate vehicle diagnosis.';
      setError(errMsg);
      addToast({
        type: 'error',
        title: 'Diagnosis Error',
        message: errMsg
      });
    }
  }, [conversationId, messages, mediaAttachments, vehicle, syncActiveConversationToHistory, addToast]);

  // Start New Session
  const startNewSession = useCallback(() => {
    setConversationId(null);
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        id: generateId('welcome'),
        created_at: new Date().toISOString()
      }
    ]);
    setMediaAttachments([]);
    setDiagnosis(null);
    setError(null);
    setIsSidebarOpen(false);

    addToast({
      type: 'info',
      title: 'New Diagnostic Session',
      message: 'Workspace reset. Describe your car symptoms to begin.'
    });
  }, [addToast]);

  // Load Session from History
  const loadSession = useCallback(
    (convId: string) => {
      const found = conversationsHistory.find((c) => c.id === convId);
      if (!found) return;

      setConversationId(found.id);
      setMessages(found.messages && found.messages.length > 0 ? found.messages : [INITIAL_WELCOME_MESSAGE]);
      setMediaAttachments(found.media_attachments || []);
      setDiagnosis(found.diagnosis || null);
      setError(null);

      if (found.car_make) {
        setVehicle((prev) => ({
          ...prev,
          make: found.car_make || prev.make,
          model: found.car_model || prev.model,
          year: found.car_year || prev.year
        }));
      }

      setIsSidebarOpen(false);

      addToast({
        type: 'info',
        title: 'Session Loaded',
        message: `Loaded diagnostic session "${found.title || found.id}"`
      });
    },
    [conversationsHistory, addToast]
  );

  // Delete Session from History
  const deleteSession = useCallback(
    (convId: string) => {
      setConversationsHistory((prev) => {
        const filtered = prev.filter((c) => c.id !== convId);
        safeLocalStorageSet(STORAGE_KEYS.CONVERSATIONS, filtered);
        return filtered;
      });

      if (conversationId === convId) {
        startNewSession();
      }

      addToast({
        type: 'info',
        title: 'Session Deleted',
        message: 'Conversation history item removed.'
      });
    },
    [conversationId, startNewSession, addToast]
  );

  // Booking Modal Handlers
  const openBookingModal = useCallback(
    (diag?: Diagnosis) => {
      setActiveBookingDiagnosis(diag || diagnosis);
      setBookingModalOpen(true);
    },
    [diagnosis]
  );

  const closeBookingModal = useCallback(() => {
    setBookingModalOpen(false);
  }, []);

  const createNewBooking = useCallback(
    async (params: {
      name: string;
      email: string;
      phone: string;
      date: string;
      time: string;
      notes?: string;
      mechanicId?: string;
      mechanicName?: string;
    }): Promise<Booking | null> => {
      const targetDiag = activeBookingDiagnosis || diagnosis;
      if (!targetDiag) {
        addToast({
          type: 'error',
          title: 'Booking Error',
          message: 'No diagnosis attached to this booking request.'
        });
        return null;
      }

      const response = await createBooking({
        diagnosis: targetDiag.id,
        customer_name: params.name,
        customer_email: params.email,
        customer_phone: params.phone,
        preferred_date: params.date,
        preferred_time: params.time,
        notes: params.notes,
        mechanic_id: params.mechanicId,
        mechanic_name: params.mechanicName,
        service_type: targetDiag.recommended_service,
        estimated_cost: targetDiag.estimated_cost
      });

      if (response.success && response.data) {
        const newBooking = response.data;
        newBooking.diagnosis_detail = targetDiag;
        newBooking.vehicle_info = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

        setBookings((prev) => {
          const updated = [newBooking, ...prev];
          safeLocalStorageSet(STORAGE_KEYS.BOOKINGS, updated);
          return updated;
        });

        if (conversationId) {
          syncActiveConversationToHistory(conversationId, messages, mediaAttachments, targetDiag, 'booked');
        }

        addToast({
          type: 'success',
          title: 'Booking Confirmed!',
          message: `Appointment scheduled for ${params.date} at ${params.time}.`
        });

        return newBooking;
      } else {
        const errMsg = response.error?.message || 'Failed to confirm booking.';
        addToast({
          type: 'error',
          title: 'Booking Failed',
          message: errMsg
        });
        return null;
      }
    },
    [activeBookingDiagnosis, diagnosis, vehicle, conversationId, messages, mediaAttachments, syncActiveConversationToHistory, addToast]
  );

  // Lightbox handlers
  const openLightbox = useCallback((media: MediaAttachment) => {
    setActiveLightboxMedia(media);
  }, []);

  const closeLightbox = useCallback(() => {
    setActiveLightboxMedia(null);
  }, []);

  // Insert OBD code into chat
  const insertOBDCode = useCallback(
    (obd: OBDCode) => {
      setIsOBDModalOpen(false);
      sendMessage(
        `Diagnostic Trouble Code Detected: [${obd.code}] - ${obd.title}. Common symptoms include: ${obd.symptoms.join(', ')}. Please evaluate root causes and repair urgency.`
      );
    },
    [sendMessage]
  );

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Compute active status
  const activeSessionStatus = useMemo<'active' | 'diagnosed' | 'booked'>(() => {
    if (bookings.some((b) => b.diagnosis === diagnosis?.id)) return 'booked';
    if (diagnosis) return 'diagnosed';
    return 'active';
  }, [bookings, diagnosis]);

  const value = useMemo(
    () => ({
      conversationId,
      messages,
      mediaAttachments,
      diagnosis,
      isLoading,
      isUploading,
      isDiagnosing,
      error,
      vehicle,
      updateVehicle,
      sendMessage,
      uploadFile,
      removeAttachment,
      triggerDiagnosis,
      startNewSession,
      loadSession,
      deleteSession,
      conversationsHistory,
      activeSessionStatus,
      bookings,
      bookingModalOpen,
      activeBookingDiagnosis,
      openBookingModal,
      closeBookingModal,
      createNewBooking,
      isMyBookingsOpen,
      setIsMyBookingsOpen,
      activeLightboxMedia,
      openLightbox,
      closeLightbox,
      isOBDModalOpen,
      setIsOBDModalOpen,
      insertOBDCode,
      toasts,
      addToast,
      removeToast,
      isBackendConnected,
      isSidebarOpen,
      setIsSidebarOpen,
      toggleSidebar
    }),
    [
      conversationId,
      messages,
      mediaAttachments,
      diagnosis,
      isLoading,
      isUploading,
      isDiagnosing,
      error,
      vehicle,
      updateVehicle,
      sendMessage,
      uploadFile,
      removeAttachment,
      triggerDiagnosis,
      startNewSession,
      loadSession,
      deleteSession,
      conversationsHistory,
      activeSessionStatus,
      bookings,
      bookingModalOpen,
      activeBookingDiagnosis,
      openBookingModal,
      closeBookingModal,
      createNewBooking,
      isMyBookingsOpen,
      activeLightboxMedia,
      openLightbox,
      closeLightbox,
      isOBDModalOpen,
      insertOBDCode,
      toasts,
      addToast,
      removeToast,
      isBackendConnected,
      isSidebarOpen,
      toggleSidebar
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
