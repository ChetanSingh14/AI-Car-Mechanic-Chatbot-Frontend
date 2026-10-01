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
  CONVERSATIONS: 'autotech_conversations_v3',
  ACTIVE_ID: 'autotech_active_id_v3',
  VEHICLE: 'autotech_vehicle_v3',
  BOOKINGS: 'autotech_bookings_v3',
  THEME: 'autotech_theme_v3'
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state initialized from storage
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return safeLocalStorageGet<'dark' | 'light'>(STORAGE_KEYS.THEME, 'dark');
  });

  // Vehicle state initialized from storage
  const [vehicle, setVehicle] = useState<VehicleInfo>(() => {
    return safeLocalStorageGet<VehicleInfo>(STORAGE_KEYS.VEHICLE, DEFAULT_VEHICLE);
  });

  // History & Bookings initialized from storage
  const [conversationsHistory, setConversationsHistory] = useState<Conversation[]>(() => {
    return safeLocalStorageGet<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    return safeLocalStorageGet<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  });

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

  // Synchronize DOM theme on mount & change
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

      // Temporary optimistic user message
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
        // Critical Bug Fix: Save the authoritative server conversation ID
        const serverConvId = response.data.conversation_id;
        setConversationId(serverConvId);

        const finalMessages = [
          ...updatedMessages.filter((m) => m.id !== tempUserMsg.id),
          response.data.user_message,
          response.data.assistant_message
        ];
        setMessages(finalMessages);

        // Update vehicle state if backend detected a car make
        if (response.data.car_make && !vehicle.make) {
          updateVehicle({
            make: response.data.car_make,
            model: response.data.car_model || vehicle.model,
            year: response.data.car_year || vehicle.year
          });
        }

        syncActiveConversationToHistory(serverConvId, finalMessages, mediaAttachments, diagnosis);
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
    [conversationId, isLoading, mediaAttachments, messages, vehicle, diagnosis, syncActiveConversationToHistory, updateVehicle, addToast]
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

        // Critical Bug Fix: Save server conversation ID if newly created on upload
        const serverConvId = newAttachment.conversation ? String(newAttachment.conversation) : conversationId;
        if (serverConvId && serverConvId !== conversationId) {
          setConversationId(serverConvId);
        }

        const effectiveConvId = serverConvId || conversationId || '';

        // System notification message
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

        if (effectiveConvId) {
          syncActiveConversationToHistory(effectiveConvId, newMessages, newAttachments, diagnosis);
        }

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
    [conversationId, mediaAttachments, messages, diagnosis, syncActiveConversationToHistory, addToast]
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

      syncActiveConversationToHistory(conversationId, messages, mediaAttachments, diag, 'diagnosed');

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
  }, [conversationId, messages, mediaAttachments, syncActiveConversationToHistory, addToast]);

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

  // Load Session from History (synchronizing with backend GET /api/conversation/{id}/)
  const loadSession = useCallback(
    async (convId: string) => {
      const foundLocal = conversationsHistory.find((c) => c.id === convId);

      setConversationId(convId);
      if (foundLocal) {
        setMessages(foundLocal.messages && foundLocal.messages.length > 0 ? foundLocal.messages : [createInitialWelcomeMessage()]);
        setMediaAttachments(foundLocal.media_attachments || []);
        setDiagnosis(foundLocal.diagnosis || null);
        if (foundLocal.car_make) {
          setVehicle((prev) => ({
            ...prev,
            make: foundLocal.car_make || prev.make,
            model: foundLocal.car_model || prev.model,
            year: foundLocal.car_year || prev.year
          }));
        }
      }
      setError(null);
      setIsSidebarOpen(false);

      // Fetch authoritative state from backend
      const serverRes = await getConversationDetails(convId);
      if (serverRes.success && serverRes.data) {
        const sData = serverRes.data;
        if (sData.messages && sData.messages.length > 0) {
          setMessages(sData.messages);
        }
        if (sData.media_attachments) {
          setMediaAttachments(sData.media_attachments);
        }
        if (sData.diagnosis) {
          setDiagnosis(sData.diagnosis);
        }
        if (sData.car_make) {
          setVehicle((prev) => ({
            ...prev,
            make: sData.car_make || prev.make,
            model: sData.car_model || prev.model,
            year: sData.car_year || prev.year
          }));
        }
      }

      addToast({
        type: 'info',
        title: 'Session Loaded',
        message: `Loaded diagnostic session.`
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
