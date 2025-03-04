
import { useState } from 'react';
import { checkUnitAvailability } from './utils/availabilityChecker';

interface UseAvailabilityCheckProps {
  setIsLoading: (isLoading: boolean) => void;
  toast: any;
}

/**
 * Hook to check unit availability for a specified date range
 */
export const useAvailabilityCheck = ({ setIsLoading, toast }: UseAvailabilityCheckProps) => {
  const checkAvailability = async (
    unitId: string,
    checkIn: Date,
    checkOut: Date
  ) => {
    try {
      setIsLoading(true);
      
      return await checkUnitAvailability(unitId, checkIn, checkOut);
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo verificar la disponibilidad. Por favor, intenta de nuevo.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { checkAvailability };
};
