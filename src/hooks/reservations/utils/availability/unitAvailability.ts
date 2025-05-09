
import { supabase } from '@/lib/supabase';
import { packageData } from '@/components/packages/packageData';
import { format } from 'date-fns';
import { checkGeneralAvailability } from './generalAvailability';

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
  
  try {
    // Primero verificamos si es una unidad de paquete (no en base de datos)
    const isPackageUnit = packageData.some(pkg => pkg.id === unitId);
    if (isPackageUnit) {
      // Para unidades de paquete, verificamos la disponibilidad general
      // ya que estas unidades comparten el mismo inventario real
      const { isAvailable } = await checkGeneralAvailability(checkIn, checkOut);
      return isAvailable;
    }
    
    // Verificamos las reservas existentes directamente
    try {
      // Configurar fechas para comparison
      const checkInDate = new Date(checkIn);
      checkInDate.setHours(0, 0, 0, 0);
      
      const checkOutDate = new Date(checkOut);
      checkOutDate.setHours(23, 59, 59, 999);
      
      // Buscamos reservas que se solapan con el rango de fechas solicitado
      const { data: overlappingReservations, error } = await supabase
        .from('reservations')
        .select('id, unit_id, check_in, check_out, status')
        .eq('status', 'confirmed')
        .or(`check_in.lte.${checkOutDate.toISOString()},check_out.gte.${checkInDate.toISOString()}`);

      if (error) {
        console.error('Error al verificar reservas existentes:', error);
        // En caso de error, asumimos que hay disponibilidad para no bloquear la experiencia
        return true;
      }

      console.log(`Encontradas ${overlappingReservations?.length} reservas solapadas totales`);
      
      const reservationsForUnit = overlappingReservations?.filter(r => r.unit_id === unitId);
      console.log(`De las cuales ${reservationsForUnit?.length} son para la unidad ${unitId}`);
      
      // Si no hay reservas para esta unidad en ese periodo, está disponible
      return !reservationsForUnit || reservationsForUnit.length === 0;
    } catch (error) {
      console.error('Error al verificar reservas:', error);
      // En caso de error, asumimos disponibilidad
      return true;
    }
  } catch (error) {
    console.error('Error general en checkUnitAvailability:', error);
    // En caso de error, asumimos disponibilidad
    return true;
  }
};
