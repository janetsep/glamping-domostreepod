import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Ajusta según la biblioteca que uses
import { useDateAvailabilityChecker } from './useDateAvailabilityChecker';

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
  
  return {
    isAvailable,
    availableDomos,
    isChecking,
    partialAvailability,
    setIsAvailable,
    setAvailableDomos,
    setPartialAvailability
  };
};