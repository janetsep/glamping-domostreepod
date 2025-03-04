
import { packageData } from '@/components/packages/packageData';
import { supabase } from '@/lib/supabase';

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
  console.log(`Verificando disponibilidad para unidad ${unitId} del ${checkIn.toISOString()} al ${checkOut.toISOString()}`);
  
  // Primero verificamos si es una unidad de paquete (no en base de datos)
  const isPackageUnit = packageData.some(pkg => pkg.id === unitId);
  if (isPackageUnit) {
    // Para unidades de paquete, asumimos que siempre están disponibles
    console.log('Unidad de paquete, asumiendo disponibilidad');
    return true;
  }
  
  // Buscamos reservaciones que se solapan con las fechas solicitadas
  const { data: existingReservations, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('unit_id', unitId)
    .eq('status', 'confirmed')
    .or(`check_in.lte.${checkOut.toISOString()},check_out.gte.${checkIn.toISOString()}`);

  if (error) {
    console.error('Error al verificar disponibilidad específica:', error);
    throw error;
  }

  console.log(`Reservaciones encontradas para unidad ${unitId}:`, existingReservations?.length || 0);
  return existingReservations?.length === 0; // True si no hay reservaciones solapadas
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
  console.log(`Verificando disponibilidad general del ${checkIn.toISOString()} al ${checkOut.toISOString()}`);
  
  // Contamos cuántas unidades tienen reservaciones confirmadas solapadas con las fechas solicitadas
  const { data: reservedUnits, error } = await supabase
    .from('reservations')
    .select('unit_id')
    .eq('status', 'confirmed')
    .or(`check_in.lte.${checkOut.toISOString()},check_out.gte.${checkIn.toISOString()}`);

  if (error) {
    console.error('Error al verificar disponibilidad general:', error);
    throw error;
  }

  // Obtenemos unidades únicas reservadas (eliminando duplicados)
  const uniqueReservedUnits = new Set(reservedUnits?.map(r => r.unit_id) || []);
  const reservedCount = uniqueReservedUnits.size;
  const availableUnits = Math.max(0, TOTAL_DOMOS - reservedCount);
  
  console.log(`Domos reservados: ${reservedCount}, Domos disponibles: ${availableUnits}`);
  
  return {
    isAvailable: availableUnits > 0,
    availableUnits,
    totalUnits: TOTAL_DOMOS
  };
};
