
import { supabase } from '@/lib/supabase';

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

    // IMPORTANTE: Usar la misma query que el calendario
    // Solo contar reservas CONFIRMADAS y con unit_id asignado
    const { data: overlappingReservations, error } = await supabase
      .from('reservations')
      .select('id, unit_id, check_in, check_out, status')
      .eq('status', 'confirmed')
      .filter('check_in', 'lt', checkOutDate.toISOString())
      .filter('check_out', 'gt', checkInDate.toISOString());

    if (error) {
      console.error('❌ [checkGeneralAvailability] Error al obtener reservas:', error);
      return { isAvailable: false, availableUnits: 0, error: error.message };
    }

    console.log('🔍 [checkGeneralAvailability] Reservas solapadas encontradas:', {
      totalReservas: overlappingReservations?.length || 0,
      reservas: overlappingReservations?.map(r => ({
        id: r.id,
        unit_id: r.unit_id,
        status: r.status,
        check_in: r.check_in,
        check_out: r.check_out
      })) || []
    });

    // CRÍTICO: Solo contar reservas que tienen unit_id asignado
    // Esta es la misma lógica que usa el calendario
    const reservedUnits = (overlappingReservations || [])
      .filter(r => r.unit_id !== null && r.unit_id !== undefined)
      .length;
    
    const availableUnits = TOTAL_DOMOS - reservedUnits;
    const isAvailable = availableUnits >= requiredDomos;
    
    console.log('✅ [checkGeneralAvailability] Resultado final:', {
      totalDomos: TOTAL_DOMOS,
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
    console.error('❌ [checkGeneralAvailability] Error general:', error);
    return { isAvailable: false, availableUnits: 0, totalUnits: TOTAL_DOMOS };
  }
};
