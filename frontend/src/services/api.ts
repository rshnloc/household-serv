import { 
  User, 
  DemoUserOption, 
  Category, 
  Professional, 
  DiagnosticResult, 
  Booking, 
  BookingDetail, 
  AdminMetrics 
} from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  getCurrentUser: async (email?: string): Promise<User> => {
    const url = email ? `${API_BASE}/auth/current-user?email=${encodeURIComponent(email)}` : `${API_BASE}/auth/current-user`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  getDemoUsers: async (): Promise<DemoUserOption[]> => {
    const res = await fetch(`${API_BASE}/auth/demo-users`);
    if (!res.ok) throw new Error('Failed to fetch demo users');
    return res.json();
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  // Professionals
  getPros: async (params?: {
    category_slug?: string;
    search?: string;
    min_rating?: number;
    max_rate?: number;
    emergency_only?: boolean;
  }): Promise<Professional[]> => {
    const query = new URLSearchParams();
    if (params?.category_slug) query.set('category_slug', params.category_slug);
    if (params?.search) query.set('search', params.search);
    if (params?.min_rating) query.set('min_rating', params.min_rating.toString());
    if (params?.max_rate) query.set('max_rate', params.max_rate.toString());
    if (params?.emergency_only) query.set('emergency_only', 'true');

    const res = await fetch(`${API_BASE}/pros?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch professionals');
    return res.json();
  },

  getProDetail: async (id: number): Promise<Professional> => {
    const res = await fetch(`${API_BASE}/pros/${id}`);
    if (!res.ok) throw new Error('Failed to fetch pro detail');
    return res.json();
  },

  // AI Diagnostic
  diagnoseIssue: async (queryText: string, customUrgency?: string): Promise<DiagnosticResult> => {
    const res = await fetch(`${API_BASE}/ai/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query_text: queryText, custom_urgency: customUrgency }),
    });
    if (!res.ok) throw new Error('AI Diagnosis failed');
    return res.json();
  },

  getQuickPrompts: async (): Promise<{ title: string; category: string; prompt: string }[]> => {
    const res = await fetch(`${API_BASE}/ai/quick-prompts`);
    if (!res.ok) throw new Error('Failed to fetch prompts');
    return res.json();
  },

  // Bookings & Escrow
  createBooking: async (data: {
    customer_id: number;
    pro_id: number;
    title: string;
    problem_description: string;
    urgency: string;
    scheduled_date: string;
    scheduled_time_slot: string;
    service_address: string;
    estimated_hours: number;
    hourly_rate: number;
    parts_estimate: number;
    escrow_fee: number;
    total_amount: number;
    payment_method?: string;
    customer_notes?: string;
  }) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Booking failed');
    return res.json();
  },

  getMyBookings: async (userId: number, role: string): Promise<Booking[]> => {
    const res = await fetch(`${API_BASE}/bookings/my-bookings?user_id=${userId}&role=${role}`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  getBookingDetail: async (id: number): Promise<BookingDetail> => {
    const res = await fetch(`${API_BASE}/bookings/${id}`);
    if (!res.ok) throw new Error('Failed to fetch booking detail');
    return res.json();
  },

  updateBookingStatus: async (bookingId: number, status: string, notes?: string) => {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  releaseEscrow: async (bookingId: number) => {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/release-escrow`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to release escrow');
    return res.json();
  },

  sendBookingMessage: async (bookingId: number, senderName: string, senderRole: string, messageText: string) => {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_name: senderName,
        sender_role: senderRole,
        message_text: messageText,
      }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  submitReview: async (bookingId: number, rating: number, comment: string) => {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment }),
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  getPaymentReceipt: async (bookingId: number) => {
    const res = await fetch(`${API_BASE}/payments/receipt/${bookingId}`);
    if (!res.ok) throw new Error('Failed to fetch receipt');
    return res.json();
  },

  // Admin
  getAdminMetrics: async (): Promise<AdminMetrics> => {
    const res = await fetch(`${API_BASE}/admin/metrics`);
    if (!res.ok) throw new Error('Failed to fetch admin metrics');
    return res.json();
  },
};
