
import { supabase } from '@/lib/supabase';
import { eachDayOfInterval, addDays } from 'date-fns';

const TOTAL_DOMOS = 4;

/**
 * Verifica la disponibilidad general para un rango de fechas
 * IMPORTANTE: Esta función debe usar la misma lógica que el calendario
 */
export const checkGeneralAvailability = async (
  checkInDate: Date,
  checkOutDate: Date,
  requiredDomos: number = 1
) => {
  try {
    console.log('🔍 [checkGeneralAvailability] Verificando disponibilidad:', {
      fechaInicio: checkInDate.toISOString().split('T')[0],
      fechaFin: checkOutDate.toISOString().split('T')[0],
      domosRequeridos: requiredDomos
    });

    // Obtener todas las reservas confirmadas para el análisis
    const { data: allReservations, error } = await supabase
      .from('reservations')
      .select('id, unit_id, check_in, check_out, status')
      .eq('status', 'confirmed')
      .not('unit_id', 'is', null);

    if (error) {
      console.error('❌ [checkGeneralAvailability] Error al obtener reservas:', error);
      return { isAvailable: false, availableUnits: 0, error: error.message };
    }

    console.log('🔍 [checkGeneralAvailability] Total reservas confirmadas con unit_id:', allReservations?.length || 0);

    // CORRECCIÓN CRÍTICA: Para una reserva del 29 al 30, solo verificamos la noche del 29
    // Esto significa que checkInDate se incluye, pero checkOutDate se excluye
    const nights = eachDayOfInterval({ 
      start: checkInDate, 
      end: addDays(checkOutDate, -1) 
    });

    // Si no hay noches a verificar, no hay disponibilidad
    if (nights.length === 0) {
      console.log('⚠️ [checkGeneralAvailability] No hay noches para verificar en el rango');
      return { isAvailable: false, availableUnits: 0, totalUnits: TOTAL_DOMOS };
    }

    let minAvailableUnits = TOTAL_DOMOS;

    console.log('🔍 [checkGeneralAvailability] Verificando noches:', {
      totalNoches: nights.length,
      noches: nights.map(night => night.toISOString().split('T')[0])
    });

    // Para cada noche, contar cuántos domos están ocupados
    for (const night of nights) {
      const nightEnd = addDays(night, 1);
      
      // Una reserva ocupa esta noche si: checkIn < nightEnd && checkOut > night
      const overlappingReservations = (allReservations || []).filter(reservation => {
        const checkIn = new Date(reservation.check_in);
        const checkOut = new Date(reservation.check_out);
        
        return checkIn < nightEnd && checkOut > night;
      });

      const occupiedUnits = overlappingReservations.length;
      const availableForThisNight = TOTAL_DOMOS - occupiedUnits;
      
      console.log(`📅 [checkGeneralAvailability] Noche ${night.toISOString().split('T')[0]}:`, {
        reservasSuperpuestas: overlappingReservations.length,
        unidadesOcupadas: occupiedUnits,
        disponiblesEstaNoche: availableForThisNight,
        reservas: overlappingReservations.map(r => ({
          id: r.id,
          unit_id: r.unit_id,
          check_in: r.check_in,
          check_out: r.check_out
        }))
      });

      // El mínimo disponible en cualquier noche determina la disponibilidad del rango
      minAvailableUnits = Math.min(minAvailableUnits, availableForThisNight);
    }

    const isAvailable = minAvailableUnits >= requiredDomos;
    
    console.log('✅ [checkGeneralAvailability] Resultado final:', {
      totalDomos: TOTAL_DOMOS,
      minimoDisponibleEnElRango: minAvailableUnits,
      unidadesRequeridas: requiredDomos,
      disponible: isAvailable
    });

    return {
      isAvailable,
      availableUnits: minAvailableUnits,
      totalUnits: TOTAL_DOMOS
    };
  } catch (error) {
    console.error('❌ [checkGeneralAvailability] Error general:', error);
    return { isAvailable: false, availableUnits: 0, totalUnits: TOTAL_DOMOS };
  }
};
