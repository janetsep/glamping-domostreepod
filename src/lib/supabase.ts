
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Reservation = {
  id: string;
  created_at: string;
  user_id: string;
  unit_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
};

export type GlampingUnit = {
  id: string;
  name: string;
  description: string;
  max_guests: number;
  price_per_night: number;
  image_url: string;
};
