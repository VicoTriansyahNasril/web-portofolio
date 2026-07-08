export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar_url: string;
  content: string;
  rating: number;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TestimonialInput {
  name: string;
  role?: string;
  company?: string;
  avatar_url?: string;
  content: string;
  rating?: number;
  is_visible?: boolean;
  sort_order?: number;
}
