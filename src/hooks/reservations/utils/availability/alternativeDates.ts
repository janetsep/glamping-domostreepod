
import { format, addDays, isSameDay } from 'date-fns';
import { checkGeneralAvailability } from './generalAvailability';

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
        // Verificar disponibilidad para estas fechas
        const result = await checkGeneralAvailability(currentStart, currentEnd);
        console.log(`Verificando fecha alternativa ${format(currentStart, 'yyyy-MM-dd')}: ${result.availableUnits} domos disponibles`);
        
        // Si hay suficientes domos disponibles
        if (result.availableUnits >= requiredDomos) {
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
          // Verificar disponibilidad para estas fechas
          const result = await checkGeneralAvailability(currentStart, currentEnd);
          console.log(`Verificando fecha alternativa anterior ${format(currentStart, 'yyyy-MM-dd')}: ${result.availableUnits} domos disponibles`);
          
          // Si hay suficientes domos disponibles
          if (result.availableUnits >= requiredDomos) {
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
          console.error(`Error al verificar fecha alternativa anterior ${format(currentStart, 'yyyy-MM-dd')}:`, error);
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
