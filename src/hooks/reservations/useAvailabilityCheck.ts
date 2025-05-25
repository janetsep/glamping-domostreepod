import { useState, useEffect } from 'react';
import { toast } from 'sonner'; // Cambiado a 'sonner' que es la biblioteca de toast utilizada en el proyecto
import { useDateAvailabilityChecker } from '../calendar/useDateAvailabilityChecker';
import { checkGeneralAvailability } from './utils/availabilityChecker/checkGeneralAvailability';

const TOTAL_DOMOS = 4;

/**
 * Hook para verificar la disponibilidad de domos para fechas específicas
 */
export const useAvailabilityCheck = (
  checkInDate: Date | null,
  checkOutDate: Date | null,
  requiredDomos: number,
  reservations: any[]
) => {
  console.error('‼️ [Debug] useAvailabilityCheck (src/hooks/reservations) HOOK EJECUTADO con reservas:', reservations, 'Pila de llamadas:', new Error().stack);
  console.log('🔍 [useAvailabilityCheck] Hook inicializado con reservas:', reservations);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [availableDomos, setAvailableDomos] = useState<number | undefined>(undefined);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [partialAvailability, setPartialAvailability] = useState<boolean>(false);
  
  const { isDateRangeAvailable } = useDateAvailabilityChecker(reservations);
  console.log('🔍 [useAvailabilityCheck] useDateAvailabilityChecker instancia obtenida con reservas:', reservations);
  
  // Comentamos temporalmente este useEffect completo para aislar la fuente de las verificaciones incorrectas
  /*
  useEffect(() => {
    const checkAvailability = async () => {
      if (!checkInDate || !checkOutDate || requiredDomos <= 0) {
        setIsAvailable(false);
        setAvailableDomos(undefined);
        setPartialAvailability(false);
        return;
      }
      
      setIsChecking(true);
      
      try {
        // Verificar disponibilidad para el rango de fechas
        const { isAvailable, availableUnits } = await isDateRangeAvailable(
          checkInDate, 
          checkOutDate,
          requiredDomos
        );
        
        // Almacenar los domos disponibles
        setAvailableDomos(availableUnits);
        
        // CORRECCIÓN: Comprobar si hay disponibilidad parcial (algunos domos, pero no suficientes)
        if (availableUnits > 0 && availableUnits < requiredDomos) {
          setPartialAvailability(true);
          setIsAvailable(false); // No hay suficientes domos
        } else {
          setPartialAvailability(false);
          if (availableUnits >= requiredDomos) {
            setIsAvailable(true);
          } else {
            setIsAvailable(false);
            toast.error(`No hay domos disponibles para las fechas seleccionadas.`);
          }
        }
      } catch (error) {
        console.error('Error al verificar la disponibilidad:', error);
        setIsAvailable(false);
        setAvailableDomos(undefined);
        setPartialAvailability(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAvailability();
  }, [checkInDate, checkOutDate, requiredDomos, reservations, isDateRangeAvailable]);
  */

  return { isAvailable, availableDomos, isChecking, partialAvailability };
};