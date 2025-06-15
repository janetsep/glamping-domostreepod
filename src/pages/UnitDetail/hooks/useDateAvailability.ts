
import { useState, useEffect } from "react";
import { checkGeneralAvailability } from "@/hooks/reservations/utils/availabilityChecker/checkGeneralAvailability";

export const useDateAvailability = (startDate?: Date, endDate?: Date) => {
  const [availableDomos, setAvailableDomos] = useState<number | undefined>(undefined);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  useEffect(() => {
    if (!startDate || !endDate) {
      setAvailableDomos(undefined);
      setIsLoadingAvailability(false);
      return;
    }

    const check = async () => {
      setIsLoadingAvailability(true);
      try {
        console.log('🔍 [useDateAvailability] Verificando disponibilidad para rango:', {
          inicio: startDate.toISOString().split('T')[0],
          fin: endDate.toISOString().split('T')[0],
        });

        // Verificamos con un requisito de 1 para obtener la disponibilidad mínima general en el rango.
        const result = await checkGeneralAvailability(startDate, endDate, 1);
        
        console.log('✅ [useDateAvailability] Resultado de checkGeneralAvailability:', {
          unidadesDisponibles: result.availableUnits,
        });

        setAvailableDomos(result.availableUnits);

      } catch (error) {
        console.error('❌ [useDateAvailability] Error calculando disponibilidad:', error);
        setAvailableDomos(0);
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    check();
  }, [startDate, endDate]);

  return {
    availableDomos,
    isLoadingAvailability,
  };
};

