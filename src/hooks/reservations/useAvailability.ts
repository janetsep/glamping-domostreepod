import { useAvailabilityCheck } from './useAvailabilityCheck';

interface UseAvailabilityProps {
  setIsLoading: (isLoading: boolean) => void;
  toast: any;
}

/**
 * Hook for checking unit availability
 * @deprecated Use useAvailabilityCheck instead
 */
export const useAvailability = (props: UseAvailabilityProps) => {
  console.error('‼️ [Debug] useAvailability HOOK EJECUTADO!');
  alert('‼️ [Debug] useAvailability HOOK EJECUTADO!');
  console.log('⚠️ [DEPRECATED Hook] useAvailability está siendo llamado. Pila de llamadas (stack trace):', new Error().stack);
  // Crear instancia de useAvailabilityCheck con valores por defecto
  // para mantener compatibilidad con el código existente
  const dummyDate = new Date();
  const dummyReservations: any[] = [];
  
  return useAvailabilityCheck(dummyDate, dummyDate, 1, dummyReservations);
};
