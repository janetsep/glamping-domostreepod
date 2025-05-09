
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { TOTAL_DOMOS } from './constants';

/**
 * Verifica la disponibilidad general de domos para el rango de fechas indicado
 * 
 * @param checkIn - Fecha de entrada
 * @param checkOut - Fecha de salida
 * @returns Promise que resuelve a un objeto con información de disponibilidad
 */
export const checkGeneralAvailability = async (
  checkIn: Date,
  checkOut: Date
): Promise<{
  isAvailable: boolean;
  availableUnits: number;
  totalUnits: number;
}> => {
  console.log(`Verificando disponibilidad general del ${format(checkIn, 'yyyy-MM-dd')} al ${format(checkOut, 'yyyy-MM-dd')}`);
  
  try {
    // Configurar fechas para comparison
    const checkInDate = new Date(checkIn);
    checkInDate.setHours(0, 0, 0, 0);
    
    const checkOutDate = new Date(checkOut);
    checkOutDate.setHours(23, 59, 59, 999);
    
    // Buscamos reservas confirmadas que se solapan con el rango de fechas solicitado
    const { data: overlappingReservations, error } = await supabase
      .from('reservations')
      .select('id, unit_id, check_in, check_out')
      .eq('status', 'confirmed')
      .or(`check_in.lte.${checkOutDate.toISOString()},check_out.gte.${checkInDate.toISOString()}`);

    if (error) {
      console.error('Error al verificar disponibilidad general:', error);
      // En caso de error, asumimos que hay disponibilidad total
      return {
        isAvailable: true,
        availableUnits: TOTAL_DOMOS,
        totalUnits: TOTAL_DOMOS
      };
    }

    if (!overlappingReservations || overlappingReservations.length === 0) {
      // No hay reservas, disponibilidad completa
      console.log(`No hay reservas existentes. Disponibilidad total: ${TOTAL_DOMOS} domos`);
      return {
        isAvailable: true,
        availableUnits: TOTAL_DOMOS,
        totalUnits: TOTAL_DOMOS
      };
    }
    
    console.log(`Encontradas ${overlappingReservations.length} reservas solapadas`);
    
    // Contamos cuántas unidades diferentes están reservadas
    const uniqueReservedUnits = new Set(
      overlappingReservations
        .filter(r => r.unit_id) // Filtrar solo las que tienen unit_id
        .map(r => r.unit_id)
    );
    const reservedUnitsCount = uniqueReservedUnits.size;
    console.log(`Unidades únicas reservadas: ${reservedUnitsCount}`);
    
    // Contar reservas sin unit_id específico (cada una cuenta como una unidad reservada)
    const reservationsWithoutUnitId = overlappingReservations.filter(r => !r.unit_id).length;
    console.log(`Reservas sin unit_id específico: ${reservationsWithoutUnitId}`);
    
    // El total de unidades reservadas es la suma de ambos tipos, pero nunca más que el total disponible
    const totalReservedCount = Math.min(TOTAL_DOMOS, reservedUnitsCount + reservationsWithoutUnitId);
    
    // Las unidades disponibles son el total menos las reservadas
    const availableUnits = Math.max(0, TOTAL_DOMOS - totalReservedCount);
    
    console.log(`Domos reservados: ${totalReservedCount}, Domos disponibles: ${availableUnits}`);
    
    return {
      isAvailable: availableUnits > 0,
      availableUnits,
      totalUnits: TOTAL_DOMOS
    };
  } catch (error) {
    console.error('Error en checkGeneralAvailability:', error);
    // En caso de error, asumimos disponibilidad total
    return {
      isAvailable: true,
      availableUnits: TOTAL_DOMOS,
      totalUnits: TOTAL_DOMOS
    };
  }
};
