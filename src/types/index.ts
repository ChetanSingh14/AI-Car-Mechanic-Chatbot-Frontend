export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type FileType = 'image' | 'audio' | 'video' | 'other';

export interface MediaAttachment {
  id: string;
  file?: string;
  file_url: string;
  file_type: FileType;
  original_name: string;
  file_size?: number;
  analysis_summary?: string;
  uploaded_at: string;
  preview_url?: string;
}

export interface Message {
  id: string;
  conversation: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  is_ai_generated: boolean;
  created_at: string;
  media_attachments?: MediaAttachment[];
}

export interface DiagnosisPart {
  name: string;
  cost_estimate: string;
  urgency: 'immediate' | 'recommended' | 'optional';
}

export interface Diagnosis {
  id: string;
  conversation: string;
  issue_title: string;
  severity: SeverityLevel;
  description: string;
  recommended_service: string;
  estimated_cost: string;
  parts_needed?: DiagnosisPart[];
  labor_hours?: string;
  safety_warning?: string;
  created_at: string;
}

export interface MechanicPartner {
  id: string;
  name: string;
  rating: number;
  reviews_count: number;
  distance: string;
  address: string;
  specialties: string[];
  hourly_rate: string;
  is_certified: boolean;
}

export interface Booking {
  id: string;
  diagnosis: string;
  diagnosis_detail?: Diagnosis;
  mechanic_id?: string;
  mechanic_name?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  preferred_date: string;
  preferred_time: string;
  service_type?: string;
  vehicle_info?: string;
  estimated_cost?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: string;
  mileage?: string;
  engine?: string;
  vin?: string;
}

export interface Conversation {
  id: string;
  car_make?: string;
  car_model?: string;
  car_year?: string;
  symptom_category?: string;
  status: 'active' | 'diagnosed' | 'booked';
  messages: Message[];
  media_attachments: MediaAttachment[];
  diagnosis?: Diagnosis;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

export interface OBDCode {
  code: string;
  category: 'Powertrain' | 'Chassis' | 'Body' | 'Network';
  title: string;
  symptoms: string[];
  severity: SeverityLevel;
}
