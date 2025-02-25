
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ynyiwhjvdrqgrjfcyfin.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlueWl3aGp2ZHJxZ3JqZmN5ZmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgxMDI5NDcsImV4cCI6MjAyMzY3ODk0N30.u2Z8gy91Tsit1XkNSi1DGpAK1u-3nNVIBUqM3iIQB_Q';

// Configuramos el cliente con retry y timeouts
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  db: {
    schema: 'public'
  }
};

export const supabase = createClient(supabaseUrl, supabaseKey, options);

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
