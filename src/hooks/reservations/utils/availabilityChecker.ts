
import { packageData } from '@/components/packages/packageData';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

/**
 * Número total de domos disponibles en el sistema
 */
const TOTAL_DOMOS = 4;

/**
 * Comprueba la disponibilidad de un domo específico para el rango de fechas indicado
 * 
 * @param unitId - ID del domo a verificar
 * @param checkIn - Fecha de entrada
 * @param checkOut - Fecha de salida
 * @returns Promise que resuelve a true si el domo está disponible
 */
export const checkUnitAvailability = async (
  unitId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> => {
  console.log(`Verificando disponibilidad para unidad ${unitId} del ${format(checkIn, 'yyyy-MM-dd')} al ${format(checkOut, 'yyyy-MM-dd')}`);
  
  // Primero verificamos si es una unidad de paquete (no en base de datos)
  const isPackageUnit = packageData.some(pkg => pkg.id === unitId);
  if (isPackageUnit) {
    // Para unidades de paquete, asumimos que siempre están disponibles
    console.log('Unidad de paquete, asumiendo disponibilidad');
    return true;
  }
  
  // Verificamos si hay disponibilidad general para las fechas
  const { isAvailable } = await checkGeneralAvailability(checkIn, checkOut);
  return isAvailable;
};

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
    const uniqueReservedUnits = new Set(overlappingReservations?.map(r => r.unit_id) || []);
    const reservedCount = uniqueReservedUnits.size;
    
    // Si las reservas no tienen unit_id específico, contamos cada reserva como una unidad reservada
    const reservationsWithoutUnitId = (overlappingReservations || []).filter(r => !r.unit_id).length;
    const totalReservedCount = Math.min(TOTAL_DOMOS, reservedCount + reservationsWithoutUnitId);
    
    const availableUnits = Math.max(0, TOTAL_DOMOS - totalReservedCount);
    
    console.log(`Domos reservados: ${totalReservedCount}, Domos disponibles: ${availableUnits}`);
    
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
