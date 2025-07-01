
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

      // Validar que las fechas sean válidas
      if (startDate >= endDate) {
        console.warn('🔍 [useDateAvailability] Fechas inválidas: startDate >= endDate');
        setAvailableDomos(0);
        return;
      }

      setIsLoadingAvailability(true);
      
      try {
        console.log('🔍 [useDateAvailability] Verificando disponibilidad para fechas:', {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        });

        const result = await checkAvailability(startDate, endDate, 1);
        
        console.log('✅ [useDateAvailability] Resultado:', {
          availableUnits: result.availableUnits,
          totalUnits: result.totalUnits,
          isAvailable: result.isAvailable,
          error: result.error
        });

        if (result.error) {
          console.error('❌ [useDateAvailability] Error en verificación:', result.error);
          setAvailableDomos(0);
        } else {
          setAvailableDomos(result.availableUnits);
        }
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
