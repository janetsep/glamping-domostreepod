
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useGlampingUnits } from './useGlampingUnits';
import { useAvailabilityCheck } from './useAvailabilityCheck';
import { usePricing } from './usePricing';
import { useReservationCreation } from './useReservationCreation';
import { usePayment } from './usePayment';

export const useReservations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Compose all the sub-hooks
  const { fetchGlampingUnits, fetchGlampingUnit } = useGlampingUnits({ setIsLoading, toast });
  const { checkAvailability } = useAvailabilityCheck({ setIsLoading, toast });
  const { calculateQuote } = usePricing();
  const { createReservation } = useReservationCreation({ 
    setIsLoading, 
    toast, 
    checkAvailability 
  });
  const { redirectToWebpay } = usePayment({ setIsLoading });

  return {
    isLoading,
    fetchGlampingUnits,
    fetchGlampingUnit,
    createReservation,
    checkAvailability,
    calculateQuote,
    redirectToWebpay
  };
};
