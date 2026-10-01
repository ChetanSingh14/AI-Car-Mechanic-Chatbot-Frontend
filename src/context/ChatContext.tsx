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
  getConversationDetails,
  listConversations,
  deleteConversation,
  listBookings,
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
  loadSession: (convId: string) => Promise<void>;
  deleteSession: (convId: string) => Promise<void>;
  refreshHistory: () => Promise<void>;

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
  refreshBookings: () => Promise<void>;

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

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const createInitialWelcomeMessage = (): Message => ({
  id: 'welcome-initial',
  conversation: '',
  sender: 'assistant',
  content: `👋 **Welcome to AutoTech AI Master Diagnostics!**\n\nI am your virtual ASE-Certified Master Automobile Technician. I can inspect and diagnose mechanical, electrical, brake, engine, and transmission issues.\n\n🛠️ **How to get started:**\n- Describe what sounds, warning lights, or handling issues you are experiencing.\n- **Upload photos, record audio/video** of the abnormal noise or engine bay.\n- Click **"Generate Diagnosis"** at any time for certified repair quotes & mechanic booking.`,
  is_ai_generated: false,
  created_at: new Date().toISOString()
});

const DEFAULT_VEHICLE: VehicleInfo = {
  make: '',
  model: '',
  year: '',
  mileage: '',
  engine: ''
};

const STORAGE_KEYS = {
  THEME: 'autotech_theme_v3'
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return safeLocalStorageGet<'dark' | 'light'>(STORAGE_KEYS.THEME, 'dark');
  });

  // Vehicle state
  const [vehicle, setVehicle] = useState<VehicleInfo>(DEFAULT_VEHICLE);

  // History & Bookings populated directly from backend Database
  const [conversationsHistory, setConversationsHistory] = useState<Conversation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Active chat state
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([createInitialWelcomeMessage()]);
  const [mediaAttachments, setMediaAttachments] = useState<MediaAttachment[]>([]);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);

  // Async loadings
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Synchronize DOM theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
      document.body.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      safeLocalStorageSet(STORAGE_KEYS.THEME, nextTheme);
      return nextTheme;
    });
  }, []);

  // Fetch Database History
  const refreshHistory = useCallback(async () => {
    const res = await listConversations();
    if (res.success && res.data) {
      setConversationsHistory(res.data);
    }
  }, []);

  // Fetch Database Bookings
  const refreshBookings = useCallback(async () => {
    const res = await listBookings();
    if (res.success && res.data) {
      setBookings(res.data);
    }
  }, []);

  // Initial Database synchronization on mount
  useEffect(() => {
    let mounted = true;
    checkBackendHealth().then((connected) => {
      if (mounted) {
        setIsBackendConnected(connected);
        if (connected) {
          refreshHistory();
          refreshBookings();
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, [refreshHistory, refreshBookings]);

  // Update vehicle
  const updateVehicle = useCallback((info: Partial<VehicleInfo>) => {
    setVehicle((prev) => ({ ...prev, ...info }));
  }, []);

  // Send Chat Message
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const tempUserMsg: Message = {
        id: generateId('msg-user-temp'),
        conversation: conversationId || '',
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
        conversation_id: conversationId || undefined,
        message: trimmed,
        car_make: vehicle.make,
        car_model: vehicle.model,
        car_year: vehicle.year,
        media_attachment_ids: mediaAttachments.map((m) => m.id)
      });

      setIsLoading(false);

      if (response.success && response.data) {
        const serverConvId = response.data.conversation_id;
        setConversationId(serverConvId);

        const finalMessages = [
          ...updatedMessages.filter((m) => m.id !== tempUserMsg.id),
          response.data.user_message,
          response.data.assistant_message
        ];
        setMessages(finalMessages);
        setMediaAttachments([]);

        if (response.data.car_make && !vehicle.make) {
          updateVehicle({
            make: response.data.car_make,
            model: response.data.car_model || vehicle.model,
            year: response.data.car_year || vehicle.year
          });
        }

        // Refresh database history list
        refreshHistory();
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
    [conversationId, isLoading, mediaAttachments, messages, vehicle, updateVehicle, refreshHistory, addToast]
  );

  // Upload Media
  const uploadFile = useCallback(
    async (file: File): Promise<MediaAttachment | null> => {
      setIsUploading(true);
      setError(null);

      const response = await uploadMedia(conversationId || undefined, file);
      setIsUploading(false);

      if (response.success && response.data) {
        const newAttachment = response.data;
        const newAttachments = [...mediaAttachments, newAttachment];
        setMediaAttachments(newAttachments);

        const serverConvId = newAttachment.conversation ? String(newAttachment.conversation) : conversationId;
        if (serverConvId && serverConvId !== conversationId) {
          setConversationId(serverConvId);
        }

        const effectiveConvId = serverConvId || conversationId || '';

        const sysMsg: Message = {
          id: generateId('sys-msg'),
          conversation: effectiveConvId,
          sender: 'system',
          content: `📎 Attached diagnostic ${newAttachment.file_type.toUpperCase()}: ${newAttachment.original_name}`,
          is_ai_generated: false,
          created_at: new Date().toISOString()
        };

        const newMessages = [...messages, sysMsg];
        setMessages(newMessages);

        refreshHistory();

        addToast({
          type: 'success',
          title: 'Media Attached',
          message: `${file.name} uploaded and queued for diagnostic inspection.`
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
    [conversationId, mediaAttachments, messages, refreshHistory, addToast]
  );

  const removeAttachment = useCallback((id: string) => {
    setMediaAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Trigger Diagnosis
  const triggerDiagnosis = useCallback(async () => {
    if (!conversationId || conversationId.startsWith('conv-')) {
      addToast({
        type: 'warning',
        title: 'Active Session Required',
        message: 'Please send a message describing your vehicle issues before requesting a diagnosis.'
      });
      return;
    }

    if (messages.filter((m) => m.sender === 'user').length === 0) {
      addToast({
        type: 'warning',
        title: 'More Details Needed',
        message: 'Please describe the car symptoms first before generating a technical diagnosis.'
      });
      return;
    }

    setIsDiagnosing(true);
    setError(null);

    const response = await generateDiagnosis(conversationId);
    setIsDiagnosing(false);

    if (response.success && response.data) {
      const diag = response.data;
      setDiagnosis(diag);
      refreshHistory();

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
  }, [conversationId, messages, refreshHistory, addToast]);

  // Start New Session
  const startNewSession = useCallback(() => {
    setConversationId(null);
    setMessages([createInitialWelcomeMessage()]);
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

  // Load Session directly from backend Database (GET /api/conversation/{id}/)
  const loadSession = useCallback(
    async (convId: string) => {
      setConversationId(convId);
      setIsSidebarOpen(false);
      setError(null);

      const serverRes = await getConversationDetails(convId);
      if (serverRes.success && serverRes.data) {
        const sData = serverRes.data;
        setMessages(sData.messages && sData.messages.length > 0 ? sData.messages : [createInitialWelcomeMessage()]);
        setMediaAttachments(sData.media_attachments || []);
        setDiagnosis(sData.diagnosis || null);
        if (sData.car_make) {
          setVehicle({
            make: sData.car_make,
            model: sData.car_model || '',
            year: sData.car_year || '',
            mileage: '',
            engine: ''
          });
        }
        addToast({
          type: 'info',
          title: 'Session Loaded',
          message: `Loaded diagnostic session from database.`
        });
      } else {
        addToast({
          type: 'error',
          title: 'Load Failed',
          message: serverRes.error?.message || 'Could not load session from database.'
        });
      }
    },
    [addToast]
  );

  // Delete Session directly from backend Database (DELETE /api/conversation/{id}/)
  const deleteSession = useCallback(
    async (convId: string) => {
      const res = await deleteConversation(convId);
      if (res.success) {
        setConversationsHistory((prev) => prev.filter((c) => c.id !== convId));
        if (conversationId === convId) {
          startNewSession();
        }
        addToast({
          type: 'info',
          title: 'Session Deleted',
          message: 'Conversation removed from database.'
        });
      } else {
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: res.error?.message || 'Failed to delete conversation.'
        });
      }
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
        mechanic_name: params.mechanicName || 'Precision Master Automotive',
        service_type: targetDiag.recommended_service,
        estimated_cost: targetDiag.estimated_cost
      });

      if (response.success && response.data) {
        const newBooking = response.data;
        newBooking.diagnosis_detail = targetDiag;
        newBooking.vehicle_info = vehicle.make
          ? `${vehicle.year || ''} ${vehicle.make} ${vehicle.model || ''}`.trim()
          : 'Customer Vehicle';

        // Refresh database bookings and conversation history
        refreshBookings();
        refreshHistory();

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
    [activeBookingDiagnosis, diagnosis, vehicle, refreshBookings, refreshHistory, addToast]
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
      refreshHistory,
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
      refreshBookings,
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
      toggleSidebar,
      theme,
      toggleTheme
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
      refreshHistory,
      conversationsHistory,
      activeSessionStatus,
      bookings,
      bookingModalOpen,
      activeBookingDiagnosis,
      openBookingModal,
      closeBookingModal,
      createNewBooking,
      isMyBookingsOpen,
      refreshBookings,
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
      toggleSidebar,
      theme,
      toggleTheme
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
