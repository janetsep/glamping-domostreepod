
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
  return useAvailabilityCheck(props);
};
