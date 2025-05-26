import { supabase } from '@/lib/supabase';

/**
 * Genera un código de reserva único en el formato RES-YYYYMMDD-XXX
 * donde XXX es un número secuencial del día
 */
export async function generateReservationCode(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `RES-${dateStr}-`;

  try {
    // Buscar el último código de reserva del día
    const { data: lastReservation, error } = await supabase
      .from('reservations')
      .select('reservation_code')
      .like('reservation_code', `${prefix}%`)
      .order('reservation_code', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error al buscar último código de reserva:', error);
      throw error;
    }

    let sequence = 1;
    if (lastReservation && lastReservation.length > 0) {
      const lastCode = lastReservation[0].reservation_code;
      const lastSequence = parseInt(lastCode.split('-')[2]);
      sequence = lastSequence + 1;
    }

    // Formatear el número secuencial con ceros a la izquierda
    const sequenceStr = sequence.toString().padStart(3, '0');
    return `${prefix}${sequenceStr}`;
  } catch (error) {
    console.error('Error generando código de reserva:', error);
    // En caso de error, usar timestamp como fallback
    const timestamp = Date.now().toString().slice(-3);
    return `${prefix}${timestamp}`;
  }
} 