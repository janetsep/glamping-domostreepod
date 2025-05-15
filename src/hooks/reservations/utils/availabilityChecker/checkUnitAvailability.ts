
import { packageData } from '@/components/packages/packageData';
import { format } from 'date-fns';
import { checkGeneralAvailability } from './checkGeneralAvailability';

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
