
import { useState, useEffect } from 'react';
import { useUnifiedAvailabilityChecker } from '@/hooks/reservations/useUnifiedAvailabilityChecker';

/**
 * Hook optimizado para verificar disponibilidad de fechas
 * Se ejecuta automáticamente cuando cambian las fechas
 */
export const useDateAvailability = (startDate?: Date, endDate?: Date) => {
  const [availableDomos, setAvailableDomos] = useState<number | undefined>(undefined);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const { checkAvailability } = useUnifiedAvailabilityChecker();

  useEffect(() => {
    const checkDatesAvailability = async () => {
      if (!startDate || !endDate) {
        setAvailableDomos(undefined);
        return;
      }

      setIsLoadingAvailability(true);
      
      try {
        console.log('🔍 [useDateAvailability] Verificando disponibilidad para fechas:', {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        });

        const result = await checkAvailability(startDate, endDate, 1);
        
        console.log('✅ [useDateAvailability] Resultado:', {
          availableUnits: result.availableUnits,
          totalUnits: result.totalUnits
        });

        setAvailableDomos(result.availableUnits);
      } catch (error) {
        console.error('❌ [useDateAvailability] Error:', error);
        setAvailableDomos(0);
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    checkDatesAvailability();
  }, [startDate, endDate, checkAvailability]);

  return {
    availableDomos,
    isLoadingAvailability
  };
};
