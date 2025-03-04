
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gtxjfmvnzrsuaxryffnt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Reservation = {
  id: string;
  created_at: string;
  user_id?: string;
  unit_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_method?: string;
  is_package_unit?: boolean;
};

export type GlampingUnit = {
  id: string;
  name: string;
  description: string;
  max_guests: number;
  prices: {
    base_price: number;
    weekend_price?: number;
    holiday_price?: number;
  };
  image_url: string;
  created_at?: string;
  pet_price?: number;
  max_pets?: number;
  available_activities?: any[];
  available_services?: any[];
};
