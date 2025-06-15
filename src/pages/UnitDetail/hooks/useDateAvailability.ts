
import { useState, useEffect } from "react";
import { eachDayOfInterval, addDays } from "date-fns";
import { checkGeneralAvailability } from "@/hooks/reservations/utils/availabilityChecker/checkGeneralAvailability";

export const useDateAvailability = (startDate?: Date, endDate?: Date, guests: number = 2) => {
  const [requiredDomos, setRequiredDomos] = useState(1);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availableDomos, setAvailableDomos] = useState<number | undefined>(undefined);
  const [isPartialAvailability, setIsPartialAvailability] = useState(false);
  const [alternativeDates, setAlternativeDates] = useState<{ startDate: Date; endDate: Date }[]>([]);

  // Efecto para calcular la disponibilidad mínima real para todo el rango de fechas
  useEffect(() => {
    if (!startDate || !endDate || guests <= 0) {
      setAvailableDomos(undefined);
      setIsAvailable(null);
      setRequiredDomos(Math.ceil(guests / 4));
      return;
    }

    const domosNecesarios = Math.ceil(guests / 4);
    setRequiredDomos(domosNecesarios);

    // Calcular la disponibilidad mínima para todo el rango
    (async () => {
      try {
        console.log('🔍 [useDateAvailability] Calculando disponibilidad para rango:', {
          inicio: startDate.toISOString().split('T')[0],
          fin: endDate.toISOString().split('T')[0],
          huéspedes: guests,
          domosRequeridos: domosNecesarios
        });

        // IMPORTANTE: Usar checkGeneralAvailability directamente para el rango completo
        // Esta función ya maneja correctamente la lógica de superposición de reservas
        const result = await checkGeneralAvailability(startDate, endDate, domosNecesarios);
        
        console.log('✅ [useDateAvailability] Resultado de checkGeneralAvailability:', {
          disponible: result.isAvailable,
          unidadesDisponibles: result.availableUnits,
          domosRequeridos: domosNecesarios
        });

        setAvailableDomos(result.availableUnits);
        setIsAvailable(result.availableUnits >= domosNecesarios);

      } catch (error) {
        console.error('❌ [useDateAvailability] Error calculando disponibilidad:', error);
        setAvailableDomos(0);
        setIsAvailable(false);
      }
    })();
  }, [startDate, endDate, guests]);

  return {
    requiredDomos,
    isAvailable,
    availableDomos,
    isPartialAvailability,
    alternativeDates,
    setIsAvailable,
    setAlternativeDates
  };
};
