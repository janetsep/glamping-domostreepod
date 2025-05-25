import { supabase } from '@/lib/supabase';

const TOTAL_DOMOS = 4;

/**
 * Verifica la disponibilidad general para un rango de fechas
 */
export const checkGeneralAvailability = async (
  checkInDate: Date,
  checkOutDate: Date,
  requiredDomos: number = 1
) => {
  try {
    // Consultar reservaciones que se solapan con el rango de fechas
    const { data: overlappingReservations, error } = await supabase
      .from('reservations')
      .select('id, unit_id, check_in, check_out')
      .eq('status', 'confirmed')
      .filter('check_in', 'lt', checkOutDate.toISOString())
      .filter('check_out', 'gt', checkInDate.toISOString());

    if (error) {
      console.error('Error fetching reservations:', error);
      return { isAvailable: false, availableUnits: 0, error: error.message };
    }

    // Usar la misma lógica que el calendario: solo contar reservas con unit_id asignado
    const reservedUnits = (overlappingReservations || [])
      .filter(r => r.unit_id !== null && r.unit_id !== undefined)
      .length;
    
    const availableUnits = TOTAL_DOMOS - reservedUnits;
    const isAvailable = availableUnits >= requiredDomos;
    
    console.log(`🔍 [checkGeneralAvailability] Verificación de disponibilidad:`, {
      fechaInicio: checkInDate.toISOString().split('T')[0],
      fechaFin: checkOutDate.toISOString().split('T')[0],
      totalReservas: overlappingReservations?.length || 0,
      reservasConUnitId: reservedUnits,
      unidadesDisponibles: availableUnits,
      unidadesRequeridas: requiredDomos,
      disponible: isAvailable
    });

    return {
      isAvailable,
      availableUnits,
      totalUnits: TOTAL_DOMOS
    };
  } catch (error) {
    console.error('Error en checkGeneralAvailability:', error);
    return { isAvailable: false, availableUnits: 0, totalUnits: TOTAL_DOMOS };
  }
};