
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
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [availableDomos, setAvailableDomos] = useState<number | undefined>(undefined);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [partialAvailability, setPartialAvailability] = useState<boolean>(false);
  
  const { isDateRangeAvailable } = useDateAvailabilityChecker(reservations);
  
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
          
          toast.warning(
            `Solo hay ${availableUnits} de ${TOTAL_DOMOS} domos disponibles. Necesitas ${requiredDomos} para tu reserva.`, 
            { duration: 6000 }
          );
        } else {
          setPartialAvailability(false);
          
          if (availableUnits >= requiredDomos) {
            setIsAvailable(true);
            toast.success(`Tenemos disponibilidad para los ${requiredDomos} domos necesarios (${availableUnits} disponibles).`);
          } else {
            setIsAvailable(false);
            toast.error(`No hay domos disponibles para las fechas seleccionadas.`);
          }
        }
        
        console.log(`Availability check results:
          - Check-in: ${checkInDate.toISOString().split('T')[0]}
          - Check-out: ${checkOutDate.toISOString().split('T')[0]}
          - Required domos: ${requiredDomos}
          - Available domos: ${availableUnits}
          - isAvailable: ${isAvailable}
          - partialAvailability: ${partialAvailability}`);
        
      } catch (error) {
        console.error('Error checking availability:', error);
        setIsAvailable(false);
        toast.error('Error al verificar disponibilidad. Por favor, inténtalo de nuevo.');
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAvailability();
  }, [checkInDate, checkOutDate, requiredDomos, reservations]);

  // Añadir funciones necesarias para resolver los errores
  const checkAvailability = async (unitId: string, checkIn: Date, checkOut: Date) => {
    try {
      const { isAvailable } = await checkGeneralAvailability(checkIn, checkOut, 1);
      return isAvailable;
    } catch (error) {
      console.error('Error en checkAvailability:', error);
      return false;
    }
  };

  const checkGeneralDomosAvailability = async (checkIn: Date, checkOut: Date, required: number = 1) => {
    return checkGeneralAvailability(checkIn, checkOut, required);
  };
  
  return {
    isAvailable,
    availableDomos,
    isChecking,
    partialAvailability,
    setIsAvailable,
    setAvailableDomos,
    setPartialAvailability,
    checkAvailability,
    checkGeneralDomosAvailability
  };
};
