export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'customer' | 'pro' | 'admin';
  phone_masked: string;
  avatar_url?: string;
  pro_profile_id?: number | null;
}

export interface DemoUserOption {
  id: number;
  email: string;
  full_name: string;
  role: 'customer' | 'pro' | 'admin';
  title: string;
  avatar_url?: string;
  pro_id?: number | null;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  icon: string;
  description: string;
  base_hourly_rate: number;
  urgency_multiplier: number;
  popular_tasks: string[];
  verified_pros_count: number;
}

export interface Professional {
  id: number;
  user_id: number;
  full_name: string;
  business_name: string;
  tagline: string;
  bio: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  hourly_rate: number;
  rating: number;
  review_count: number;
  jobs_completed: number;
  years_experience: number;
  verification_status: 'verified' | 'pending' | 'unverified';
  background_check_cleared: boolean;
  insured_amount: string;
  license_number: string;
  identity_verified: boolean;
  skills: string[];
  badges: string[];
  service_radius_miles: number;
  location_city: string;
  available_now: boolean;
  emergency_capable: boolean;
  profile_image: string;
  reviews?: ProReview[];
}

export interface ProReview {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  sentiment_tag: string;
  ai_summary?: string;
  date: string;
}

export interface PricingEstimate {
  hourly_rate: number;
  base_rate: number;
  urgency_multiplier: number;
  estimated_hours_range: [number, number];
  estimated_typical_hours: number;
  parts_estimate: number;
  escrow_guarantee_fee: number;
  total_min: number;
  total_typical: number;
  total_max: number;
  currency: string;
}

export interface DiagnosticResult {
  status: string;
  category_slug: string;
  category_name: string;
  detected_urgency: 'standard' | 'priority_same_day' | 'emergency_24_7';
  is_critical_hazard: boolean;
  safety_alerts: string[];
  likely_causes: string[];
  immediate_actions: string[];
  recommended_parts: string[];
  scope_checklist: string[];
  pricing_estimate: PricingEstimate;
  ai_confidence_score: number;
  summary: string;
  matched_professionals: Professional[];
}

export interface Booking {
  id: number;
  booking_reference: string;
  title: string;
  problem_description: string;
  urgency: 'standard' | 'priority_same_day' | 'emergency_24_7';
  scheduled_date: string;
  scheduled_time_slot: string;
  service_address: string;
  total_amount: number;
  status: 'pending_confirmation' | 'confirmed' | 'pro_en_route' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'escrow_held' | 'released_to_pro' | 'refunded';
  escrow_transaction_id: string;
  category_name: string;
  category_slug: string;
  pro_id: number;
  pro_name: string;
  pro_business: string;
  pro_image: string;
  pro_phone: string;
  customer_id: number;
  customer_name: string;
  has_review: boolean;
  review_rating?: number | null;
  created_at: string;
}

export interface BookingDetail extends Booking {
  estimated_hours: number;
  hourly_rate: number;
  parts_estimate: number;
  escrow_fee: number;
  payment_method: string;
  pro_notes?: string;
  completed_at?: string;
  pro: {
    id: number;
    name: string;
    business_name: string;
    tagline: string;
    rating: number;
    review_count: number;
    image: string;
    phone: string;
    license: string;
    insured: string;
  };
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  messages: {
    id: number;
    sender_name: string;
    sender_role: 'customer' | 'pro' | 'system';
    message_text: string;
    time: string;
  }[];
  review?: {
    rating: number;
    comment: string;
    sentiment_tag: string;
  } | null;
}

export interface AdminMetrics {
  overview: {
    total_gmv: number;
    escrow_held_balance: number;
    payouts_released: number;
    platform_escrow_revenue: number;
    total_bookings: number;
    active_jobs: number;
    completed_jobs: number;
    total_verified_pros: number;
    total_reviews: number;
    platform_average_rating: number;
  };
  recent_activity: {
    time: string;
    event: string;
    type: string;
  }[];
}
