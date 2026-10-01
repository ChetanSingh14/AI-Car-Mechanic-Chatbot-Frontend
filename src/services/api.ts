import { ApiResponse, Booking, Conversation, Diagnosis, MediaAttachment, Message } from '../types';

/**
 * Single Source of Truth for AutoTech API Configuration & Endpoints
 * Defaults to localhost for local development, or reads environment variables for production.
 */
export const BACKEND_TARGET_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:8000/api';

export const PROXY_API_PATH = '/api/backend';

/**
 * Anonymous Client Token generator / reader for browser session privacy isolation.
 * Stored in localStorage and sent in X-Client-Token header on all API requests.
 */
export function getClientToken(): string {
  if (typeof window === 'undefined') return '';
  let token = localStorage.getItem('autotech_client_token');
  if (!token) {
    token = 'clt_' + Math.random().toString(36).substring(2, 14) + '_' + Date.now().toString(36);
    localStorage.setItem('autotech_client_token', token);
  }
  return token;
}

/**
 * Dynamic API Base URL resolution:
 * When accessed over HTTPS (e.g. on Vercel) and the EC2 backend is plain HTTP,
 * client requests are routed via the same-origin proxy (/api/backend)
 * to prevent Mixed Content security blocking by the browser.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const isHttps = window.location.protocol === 'https:';
    if (isHttps && BACKEND_TARGET_URL.startsWith('http://')) {
      return PROXY_API_PATH;
    }
  }
  return BACKEND_TARGET_URL;
}

export const BACKEND_SERVER_ORIGIN = BACKEND_TARGET_URL.replace(/\/api\/?$/, '');

/**
 * Universal Server Proxy Handler for Next.js Route Dispatcher:
 * Forwards requests server-to-server to the backend without CORS/Mixed-Content issues.
 * Passes along the X-Client-Token header for privacy isolation.
 */
export async function handleBackendProxy(
  request: Request,
  pathSegments: string[],
  queryString: string = ''
): Promise<Response> {
  try {
    const targetBase = BACKEND_TARGET_URL.replace(/\/$/, '');
    const pathStr = (pathSegments || []).join('/');
    const normalizedPath = pathStr.endsWith('/') ? pathStr : `${pathStr}/`;
    const targetUrl = `${targetBase}/${normalizedPath}${queryString}`;

    const headers = new Headers();
    const contentType = request.headers.get('content-type');
    if (contentType) headers.set('content-type', contentType);
    const accept = request.headers.get('accept');
    if (accept) headers.set('accept', accept);

    // Forward privacy client token
    const clientToken = request.headers.get('x-client-token');
    if (clientToken) headers.set('x-client-token', clientToken);

    let body: BodyInit | null = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.arrayBuffer();
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
    });

    const data = await response.arrayBuffer();
    const resHeaders = new Headers();
    const resContentType = response.headers.get('content-type');
    if (resContentType) resHeaders.set('content-type', resContentType);

    return new Response(data, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Backend proxy error';
    return new Response(
      JSON.stringify({ success: false, error: { code: 'PROXY_ERROR', message } }),
      {
        status: 502,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
}

/**
 * Universal Media Proxy Handler:
 * Streams uploaded media files (images/audio/video) from the backend server over HTTPS.
 */
export async function handleMediaProxy(
  request: Request,
  pathSegments: string[],
  queryString: string = ''
): Promise<Response> {
  try {
    const pathStr = (pathSegments || []).join('/');
    const targetUrl = `${BACKEND_SERVER_ORIGIN}/media/${pathStr}${queryString}`;

    const headers = new Headers();
    const accept = request.headers.get('accept');
    if (accept) headers.set('accept', accept);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    const data = await response.arrayBuffer();
    const resHeaders = new Headers();
    const resContentType = response.headers.get('content-type');
    if (resContentType) resHeaders.set('content-type', resContentType);
    resHeaders.set('cache-control', 'public, max-age=86400');

    return new Response(data, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Media proxy error';
    return new Response(
      JSON.stringify({ success: false, error: { code: 'MEDIA_PROXY_ERROR', message } }),
      {
        status: 502,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
}

/**
 * Normalizes media attachment URLs so relative paths point to proper endpoint.
 */
export function normalizeMediaAttachment(att: MediaAttachment): MediaAttachment {
  const normalize = (url?: string): string => {
    if (!url) return '';
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;
    if (url.includes('/media/')) {
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      if (isHttps) {
        return url.substring(url.indexOf('/media/'));
      }
    }
    return url;
  };

  return {
    ...att,
    file_url: normalize(att.file_url),
    preview_url: normalize(att.preview_url || att.file_url)
  };
}

/**
 * Check backend API health using dedicated /api/health/ endpoint
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${getApiBaseUrl()}/health/`, {
      method: 'GET',
      headers: {
        'X-Client-Token': getClientToken()
      },
      signal: controller.signal
    }).catch(() => null);

    clearTimeout(timeoutId);
    return !!res && (res.ok || res.status === 200);
  } catch {
    return false;
  }
}

/**
 * Send chat message to backend
 */
export async function sendChatMessage(params: {
  conversation_id?: string;
  message: string;
  car_make?: string;
  car_model?: string;
  car_year?: string;
  media_attachment_ids?: string[];
}): Promise<
  ApiResponse<{
    conversation_id: string;
    car_make: string;
    car_model: string;
    car_year: string;
    status: 'active' | 'diagnosed' | 'booked';
    user_message: Message;
    assistant_message: Message;
    is_ai_generated: boolean;
  }>
> {
  // Only send valid UUIDs to backend, omit temporary local ids (e.g. conv-xxx)
  const isClientOnlyId = params.conversation_id && params.conversation_id.startsWith('conv-');
  const payloadId = isClientOnlyId ? undefined : params.conversation_id;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${getApiBaseUrl()}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Token': getClientToken()
      },
      body: JSON.stringify({
        conversation_id: payloadId,
        message: params.message,
        car_make: params.car_make,
        car_model: params.car_model,
        car_year: params.car_year,
        media_attachment_ids: params.media_attachment_ids
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await res.json().catch(() => null);

    if (!res.ok || !data || data.success === false) {
      const errorMsg =
        data?.error?.message ||
        data?.detail ||
        (data ? JSON.stringify(data) : `Server responded with status ${res.status}`);
      return {
        success: false,
        error: {
          code: data?.error?.code || 'CHAT_ERROR',
          message: errorMsg
        }
      };
    }

    if (data.data) {
      if (data.data.user_message?.media_attachments) {
        data.data.user_message.media_attachments = data.data.user_message.media_attachments.map(normalizeMediaAttachment);
      }
      if (data.data.assistant_message?.media_attachments) {
        data.data.assistant_message.media_attachments = data.data.assistant_message.media_attachments.map(normalizeMediaAttachment);
      }
    }
    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Network error communicating with diagnostic server.';
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: errorMessage
      }
    };
  }
}

/**
 * Upload media file (Max 4 MB limit)
 */
export async function uploadMedia(
  conversationId?: string,
  file?: File
): Promise<ApiResponse<MediaAttachment>> {
  if (!file) {
    return {
      success: false,
      error: { code: 'INVALID_FILE', message: 'No file provided for upload.' }
    };
  }

  const MAX_SIZE = 4 * 1024 * 1024; // 4MB
  if (file.size > MAX_SIZE) {
    return {
      success: false,
      error: {
        code: 'FILE_TOO_LARGE',
        message: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 4 MB upload limit.`
      }
    };
  }

  const isValidConvId = conversationId && !conversationId.startsWith('conv-') && conversationId !== 'null';

  try {
    const formData = new FormData();
    if (isValidConvId) {
      formData.append('conversation_id', conversationId);
    }
    formData.append('file', file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    const res = await fetch(`${getApiBaseUrl()}/upload/`, {
      method: 'POST',
      headers: {
        'X-Client-Token': getClientToken()
      },
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.status === 413) {
      return {
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: 'File payload too large (maximum 4 MB supported). Please choose a smaller file or shorter recording.'
        }
      };
    }

    const data = await res.json().catch(() => null);

    if (!res.ok || !data || data.success === false) {
      const errorMsg = data?.error?.message || data?.detail || `Upload failed with status ${res.status}`;
      return {
        success: false,
        error: {
          code: data?.error?.code || 'UPLOAD_ERROR',
          message: errorMsg
        }
      };
    }

    if (data.data) {
      data.data = normalizeMediaAttachment(data.data);
    }
    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Network error uploading media file.';
    return {
      success: false,
      error: {
        code: 'UPLOAD_FAILED',
        message: errorMessage
      }
    };
  }
}

/**
 * Generate technical diagnosis and cost estimation
 */
export async function generateDiagnosis(
  conversationId: string
): Promise<ApiResponse<Diagnosis>> {
  const isValidConvId = conversationId && !conversationId.startsWith('conv-') && conversationId !== 'null';

  if (!isValidConvId) {
    return {
      success: false,
      error: {
        code: 'INVALID_CONVERSATION',
        message: 'A registered diagnostic session is required before generating a diagnosis.'
      }
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${getApiBaseUrl()}/diagnosis/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Token': getClientToken()
      },
      body: JSON.stringify({ conversation_id: conversationId }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await res.json().catch(() => null);

    if (!res.ok || !data || data.success === false) {
      const errorMsg = data?.error?.message || data?.detail || `Diagnosis request failed with status ${res.status}`;
      return {
        success: false,
        error: {
          code: data?.error?.code || 'DIAGNOSIS_ERROR',
          message: errorMsg
        }
      };
    }

    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to generate vehicle diagnosis.';
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: errorMessage
      }
    };
  }
}

/**
 * Create a new mechanic booking
 */
export async function createBooking(params: {
  diagnosis: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  preferred_date: string;
  preferred_time: string;
  notes?: string;
  mechanic_id?: string;
  mechanic_name?: string;
  service_type?: string;
  estimated_cost?: string;
}): Promise<ApiResponse<Booking>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${getApiBaseUrl()}/booking/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Token': getClientToken()
      },
      body: JSON.stringify(params),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await res.json().catch(() => null);

    if (!res.ok || !data || data.success === false) {
      const errorMsg = data?.error?.message || data?.detail || `Booking request failed with code ${res.status}`;
      return {
        success: false,
        error: {
          code: data?.error?.code || 'BOOKING_ERROR',
          message: errorMsg
        }
      };
    }

    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Network error confirming booking appointment.';
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: errorMessage
      }
    };
  }
}

/**
 * Fetch booking details by ID
 */
export async function getBookingDetails(bookingId: string): Promise<ApiResponse<Booking>> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/booking/${bookingId}/`, {
      headers: {
        'X-Client-Token': getClientToken()
      }
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || data.success === false) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: data?.error?.message || `Booking ${bookingId} not found.` }
      };
    }
    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch booking details';
    return {
      success: false,
      error: { code: 'NOT_FOUND', message: errorMessage }
    };
  }
}

/**
 * Fetch conversation details by ID from backend
 */
export async function getConversationDetails(conversationId: string): Promise<ApiResponse<Conversation>> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/conversation/${conversationId}/`, {
      headers: {
        'X-Client-Token': getClientToken()
      }
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || data.success === false) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: data?.error?.message || `Conversation ${conversationId} not found.` }
      };
    }

    if (data.data) {
      if (data.data.messages) {
        data.data.messages = data.data.messages.map((msg: Message) => ({
          ...msg,
          media_attachments: (msg.media_attachments || []).map(normalizeMediaAttachment)
        }));
      }
      if (data.data.media_attachments) {
        data.data.media_attachments = data.data.media_attachments.map(normalizeMediaAttachment);
      }
    }
    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch conversation history';
    return {
      success: false,
      error: { code: 'NOT_FOUND', message: errorMessage }
    };
  }
}

/**
 * List all conversations directly from backend Database for current client token
 */
export async function listConversations(): Promise<ApiResponse<Conversation[]>> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/conversation/`, {
      headers: {
        'X-Client-Token': getClientToken()
      }
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || data.success === false) {
      return {
        success: false,
        error: { code: 'FETCH_ERROR', message: data?.error?.message || 'Failed to list conversations from database' }
      };
    }
    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to list conversations';
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: errorMessage }
    };
  }
}

/**
 * Delete conversation from backend Database
 */
export async function deleteConversation(conversationId: string): Promise<ApiResponse<{ id: string; deleted: boolean }>> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/conversation/${conversationId}/`, {
      method: 'DELETE',
      headers: {
        'X-Client-Token': getClientToken()
      }
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || data.success === false) {
      return {
        success: false,
        error: { code: 'DELETE_ERROR', message: data?.error?.message || 'Failed to delete conversation' }
      };
    }
    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Network error deleting conversation';
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: errorMessage }
    };
  }
}

/**
 * List bookings directly from backend Database for current client token
 */
export async function listBookings(email?: string): Promise<ApiResponse<Booking[]>> {
  try {
    const query = email ? `?email=${encodeURIComponent(email)}` : '';
    const res = await fetch(`${getApiBaseUrl()}/booking/${query}`, {
      headers: {
        'X-Client-Token': getClientToken()
      }
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || data.success === false) {
      return {
        success: false,
        error: { code: 'FETCH_ERROR', message: data?.error?.message || 'Failed to list bookings from database' }
      };
    }
    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to list bookings';
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: errorMessage }
    };
  }
}
