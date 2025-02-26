
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ynyiwhjvdrqgrjfcyfin.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlueWl3aGp2ZHJxZ3JqZmN5ZmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8';

// Actualizamos la configuración del cliente con opciones más robustas
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey
    }
  },
  db: {
    schema: 'public'
  },
  // Agregamos configuración de retries y timeouts
  realtime: {
    params: {
      eventsPerSecond: 10
    }
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
