import { createClient } from '@supabase/supabase-js';

// Obtener las credenciales de las variables de entorno
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Faltan las credenciales de Supabase en las variables de entorno');
}

// Crear el cliente de Supabase con la clave de servicio
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}); 