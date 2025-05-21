
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { TOTAL_DOMOS } from './index';

/**
 * Verifica la disponibilidad general de domos para el rango de fechas indicado
 * Considera que hay disponibilidad si al menos un domo está libre
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
    
    // Buscamos reservas que se solapan con el rango de fechas solicitado
    const { data: overlappingReservations, error } = await supabase
      .from('reservations')
      .select('id, unit_id, check_in, check_out')
      .eq('status', 'confirmed')
      .or(`check_in.lte.${checkOutDate.toISOString()},check_out.gte.${checkInDate.toISOString()}`);

    if (error) {
      console.error('Error al verificar disponibilidad general:', error);
      throw error;
    }

    console.log(`Encontradas ${overlappingReservations?.length || 0} reservas solapadas`);
    
    // Contamos cuántas unidades diferentes están reservadas
    const uniqueUnitIds = new Set<string>();
    let unassignedReservationsCount = 0;
    
    // Procesar cada reserva solapada
    overlappingReservations?.forEach(reservation => {
      if (reservation.unit_id) {
        uniqueUnitIds.add(reservation.unit_id);
      } else {
        // Reservas sin unit_id específico cuentan como unidades separadas
        unassignedReservationsCount++;
      }
    });
    
    // Total de unidades reservadas: unidades únicas con ID + reservas sin ID asignado
    const totalReservedCount = uniqueUnitIds.size + unassignedReservationsCount;
    
    // Asegurarnos que no exceda el total de domos disponibles
    const effectiveReservedCount = Math.min(TOTAL_DOMOS, totalReservedCount);
    
    const availableUnits = Math.max(0, TOTAL_DOMOS - effectiveReservedCount);
    
    console.log(`Domos reservados: ${effectiveReservedCount}, Domos disponibles: ${availableUnits}`);
    
    return {
      isAvailable: availableUnits > 0,
      availableUnits,
      totalUnits: TOTAL_DOMOS
    };
  } catch (error) {
    console.error('Error en checkGeneralAvailability:', error);
    return {
      isAvailable: false,
      availableUnits: 0,
      totalUnits: TOTAL_DOMOS
    };
  }
};
