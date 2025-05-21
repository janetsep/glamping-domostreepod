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
      .or(`check_in.lte.${checkOutDate.toISOString()},check_out.gte.${checkInDate.toISOString()}`);

    if (error) {
      console.error('Error fetching reservations:', error);
      return { isAvailable: false, availableUnits: 0, error: error.message };
    }

    // CORRECCIÓN: Contar correctamente las unidades reservadas
    // Obtener unit_ids únicos
    const uniqueReservedUnits = new Set(overlappingReservations?.map(r => r.unit_id).filter(Boolean));
    const reservedWithUnitId = uniqueReservedUnits.size;
    
    // Contar reservas sin unit_id asignado
    const reservationsWithoutUnitId = (overlappingReservations || []).filter(r => !r.unit_id).length;
    
    // Calcular unidades totales reservadas
    const totalReservedCount = Math.min(TOTAL_DOMOS, reservedWithUnitId + reservationsWithoutUnitId);
    
    // Calcular unidades disponibles
    const availableUnits = TOTAL_DOMOS - totalReservedCount;
    
    console.log(`Availability check for ${checkInDate.toISOString().split('T')[0]} to ${checkOutDate.toISOString().split('T')[0]}:
      - Total overlapping reservations: ${overlappingReservations?.length || 0}
      - Unique units with ID: ${reservedWithUnitId}
      - Reservations without unit_id: ${reservationsWithoutUnitId}
      - Total reserved: ${totalReservedCount}
      - Available units: ${availableUnits}
      - Required units: ${requiredDomos}
      - Is available: ${availableUnits >= requiredDomos}`);

    return {
      isAvailable: availableUnits >= requiredDomos,
      availableUnits,
      error: null
    };
  } catch (error: any) {
    console.error('Error in checkGeneralAvailability:', error);
    return { isAvailable: false, availableUnits: 0, error: error.message };
  }
};