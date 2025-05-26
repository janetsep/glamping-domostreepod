import { supabase } from '@/lib/supabase';

/**
 * Genera un código único de reserva en el formato YYYYMMDD-XXX
 * donde XXX es un número secuencial para el día
 */
export const generateReservationCode = async (): Promise<string> => {
  try {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `${dateStr}-`;

    // Obtener el último código de reserva del día
    const { data: lastReservation, error } = await supabase
      .from('reservations')
      .select('reservation_code')
      .like('reservation_code', `${prefix}%`)
      .order('reservation_code', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error al obtener último código de reserva:', error);
      // Fallback: usar timestamp como sufijo
      return `${prefix}${Date.now().toString().slice(-3)}`;
    }

    if (!lastReservation || lastReservation.length === 0) {
      // Primer código del día
      return `${prefix}001`;
    }

    // Extraer el número secuencial y aumentarlo
    const lastCode = lastReservation[0].reservation_code;
    const lastNumber = parseInt(lastCode.split('-')[1]);
    const nextNumber = (lastNumber + 1).toString().padStart(3, '0');

    return `${prefix}${nextNumber}`;
  } catch (error) {
    console.error('Error generando código de reserva:', error);
    // Fallback: usar timestamp como sufijo
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    return `${dateStr}-${Date.now().toString().slice(-3)}`;
  }
}; 