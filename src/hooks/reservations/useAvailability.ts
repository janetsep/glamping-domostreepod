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
  // Hook deprecado - se mantiene por compatibilidad
  // Crear instancia de useAvailabilityCheck con valores por defecto
  // para mantener compatibilidad con el código existente
  const dummyDate = new Date();
  const dummyReservations: any[] = [];
  
  return useAvailabilityCheck(dummyDate, dummyDate, 1, dummyReservations);
};
