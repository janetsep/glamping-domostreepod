
import { packageData } from '@/components/packages/packageData';
import { supabase } from '@/lib/supabase';
import { format, addDays, isSameDay } from 'date-fns';

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
  
  try {
    // Primero verificamos si es una unidad de paquete (no en base de datos)
    const isPackageUnit = packageData.some(pkg => pkg.id === unitId);
    if (isPackageUnit) {
      // Para unidades de paquete, verificamos la disponibilidad general
      // ya que estas unidades comparten el mismo inventario real
      const { isAvailable } = await checkGeneralAvailability(checkIn, checkOut);
      return isAvailable;
    }
    
    // Verificamos las reservas existentes directamente en lugar de usar la tabla unit_availability
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
        console.error('Error al verificar reservas existentes:', error);
        // En caso de error, asumimos que hay disponibilidad para no bloquear la experiencia
        return true;
      }

      const reservationsForUnit = overlappingReservations?.filter(r => r.unit_id === unitId);
      
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
    
    // Buscamos reservas que se solapan con el rango de fechas solicitado
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
      return {
        isAvailable: true,
        availableUnits: TOTAL_DOMOS,
        totalUnits: TOTAL_DOMOS
      };
    }
    
    console.log(`Encontradas ${overlappingReservations.length} reservas solapadas`);
    
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
    // En caso de error, asumimos disponibilidad total
    return {
      isAvailable: true,
      availableUnits: TOTAL_DOMOS,
      totalUnits: TOTAL_DOMOS
    };
  }
};

/**
 * Encuentra fechas alternativas cercanas para la cantidad de domos solicitada
 * 
 * @param checkIn - Fecha de entrada original
 * @param checkOut - Fecha de salida original
 * @param requiredDomos - Número de domos requeridos
 * @param maxDaysToCheck - Número máximo de días a verificar (por defecto 14)
 * @returns Promise que resuelve a un array de rangos de fechas alternativas
 */
export const findAlternativeDates = async (
  checkIn: Date,
  checkOut: Date,
  requiredDomos: number,
  maxDaysToCheck: number = 14
): Promise<{startDate: Date, endDate: Date}[]> => {
  console.log(`Buscando fechas alternativas para ${requiredDomos} domos, a partir del ${format(checkIn, 'yyyy-MM-dd')}`);
  
  try {
    const stayDuration = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const alternativeDates: {startDate: Date, endDate: Date}[] = [];
    
    // Verificar días posteriores
    let currentStart = new Date(checkIn);
    for (let i = 1; i <= maxDaysToCheck; i++) {
      currentStart = addDays(checkIn, i);
      const currentEnd = addDays(currentStart, stayDuration);
      
      try {
        // Verificar disponibilidad para cada día en el rango
        let hasEnoughDomos = true;
        for (let day = 0; day < stayDuration; day++) {
          const currentDay = addDays(currentStart, day);
          const { availableUnits } = await checkGeneralAvailability(currentDay, addDays(currentDay, 1));
          
          if (availableUnits < requiredDomos) {
            hasEnoughDomos = false;
            break;
          }
        }
        
        if (hasEnoughDomos) {
          alternativeDates.push({
            startDate: currentStart,
            endDate: currentEnd
          });
          
          // Si encontramos 3 opciones, detenemos la búsqueda
          if (alternativeDates.length >= 3) {
            break;
          }
        }
      } catch (error) {
        console.error(`Error al verificar fecha alternativa ${format(currentStart, 'yyyy-MM-dd')}:`, error);
        // Continuamos con la siguiente fecha
        continue;
      }
    }
    
    // Verificar días anteriores si no encontramos suficientes alternativas
    if (alternativeDates.length < 3) {
      currentStart = new Date(checkIn);
      for (let i = 1; i <= maxDaysToCheck && alternativeDates.length < 3; i++) {
        currentStart = addDays(checkIn, -i);
        
        // No mostrar fechas pasadas
        if (currentStart < new Date()) {
          continue;
        }
        
        const currentEnd = addDays(currentStart, stayDuration);
        
        try {
          // Verificar disponibilidad para cada día en el rango
          let hasEnoughDomos = true;
          for (let day = 0; day < stayDuration; day++) {
            const currentDay = addDays(currentStart, day);
            const { availableUnits } = await checkGeneralAvailability(currentDay, addDays(currentDay, 1));
            
            if (availableUnits < requiredDomos) {
              hasEnoughDomos = false;
              break;
            }
          }
          
          if (hasEnoughDomos) {
            // Comprobar que no es un duplicado
            const isDuplicate = alternativeDates.some(dates => 
              isSameDay(dates.startDate, currentStart) && isSameDay(dates.endDate, currentEnd)
            );
            
            if (!isDuplicate) {
              alternativeDates.push({
                startDate: currentStart,
                endDate: currentEnd
              });
            }
          }
        } catch (error) {
          console.error(`Error al verificar fecha alternativa ${format(currentStart, 'yyyy-MM-dd')}:`, error);
          // Continuamos con la siguiente fecha
          continue;
        }
      }
    }
    
    console.log(`Encontradas ${alternativeDates.length} fechas alternativas`);
    
    // Ordenar por cercanía a la fecha original
    alternativeDates.sort((a, b) => {
      const distA = Math.abs(a.startDate.getTime() - checkIn.getTime());
      const distB = Math.abs(b.startDate.getTime() - checkIn.getTime());
      return distA - distB;
    });
    
    return alternativeDates;
  } catch (error) {
    console.error('Error general en findAlternativeDates:', error);
    // En caso de error, retornamos un array vacío
    return [];
  }
};
