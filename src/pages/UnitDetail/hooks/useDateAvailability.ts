
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
        console.log('🔍 [useDateAvailability] Calculando disponibilidad mínima para rango:', {
          inicio: startDate.toISOString().split('T')[0],
          fin: endDate.toISOString().split('T')[0],
          huéspedes: guests,
          domosRequeridos: domosNecesarios
        });

        // Obtener todas las noches del rango (excluyendo la fecha de checkout)
        const nights = eachDayOfInterval({ 
          start: startDate, 
          end: addDays(endDate, -1) 
        });

        let minAvailableDomos = Infinity;

        // Verificar disponibilidad para cada noche individualmente
        // USAR LA MISMA LÓGICA que checkGeneralAvailability
        for (const night of nights) {
          const nextDay = addDays(night, 1);
          
          const result = await checkGeneralAvailability(night, nextDay, domosNecesarios);
          
          console.log(`🔍 [useDateAvailability] Noche ${night.toISOString().split('T')[0]}:`, {
            disponibles: result.availableUnits,
            requeridos: domosNecesarios
          });
          
          if (typeof result.availableUnits === 'number') {
            minAvailableDomos = Math.min(minAvailableDomos, result.availableUnits);
          } else {
            // Si alguna noche no tiene datos válidos, no hay disponibilidad
            minAvailableDomos = 0;
            break;
          }
        }

        // Si no se encontraron datos válidos, establecer en 0
        if (minAvailableDomos === Infinity) {
          minAvailableDomos = 0;
        }

        console.log('✅ [useDateAvailability] Disponibilidad mínima final:', {
          nochesVerificadas: nights.length,
          domosMinimosDisponibles: minAvailableDomos,
          domosRequeridos: domosNecesarios,
          disponible: minAvailableDomos >= domosNecesarios
        });

        setAvailableDomos(minAvailableDomos);
        setIsAvailable(minAvailableDomos >= domosNecesarios);

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
