
import { useState } from 'react';
import { useAvailabilityCheck } from './useAvailabilityCheck';
import { usePricing } from './usePricing';
import { useReservationCreation } from './useReservationCreation';
import { usePayment } from './usePayment';
import { useGlampingUnits } from './useGlampingUnits';
import { useToast } from '@/components/ui/use-toast';
import { Activity, ThemedPackage } from '@/types';

export const useReservations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Import other hooks
  const { checkAvailability, checkGeneralDomosAvailability } = useAvailabilityCheck({ setIsLoading, toast });
  const { calculateQuote } = usePricing();
  const { createReservation } = useReservationCreation({ 
    setIsLoading, 
    toast,
    checkAvailability
  });
  const { redirectToWebpay } = usePayment({ setIsLoading });
  // Fix: Pass the required parameter to useGlampingUnits
  const { fetchGlampingUnits } = useGlampingUnits({ setIsLoading });
  
  const createReservationAndRedirect = async (
    unitId: string,
    checkIn: Date,
    checkOut: Date,
    guests: number,
    totalPrice: number,
    selectedActivities: Activity[] = [],
    selectedPackages: ThemedPackage[] = []
  ) => {
    setIsLoading(true);
    
    try {
      // Get IDs for activities and packages
      const activityIds = selectedActivities.map(a => a.id);
      const packageIds = selectedPackages.map(p => p.id);
      
      // Create the reservation
      const reservation = await createReservation(
        unitId,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        'webpay',
        activityIds,
        packageIds
      );
      
      if (reservation) {
        const isPackageUnit = reservation.is_package_unit || false;
        await redirectToWebpay(reservation.id, totalPrice, isPackageUnit, unitId);
      } else {
        setIsLoading(false);
      }
      
      return reservation;
    } catch (error) {
      console.error('Error in createReservationAndRedirect:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar tu reserva. Por favor, inténtalo de nuevo."
      });
      setIsLoading(false);
      return null;
    }
  };
  
  return {
    isLoading,
    setIsLoading,
    checkAvailability,
    checkGeneralAvailability: checkGeneralDomosAvailability,
    calculateQuote,
    createReservation,
    redirectToWebpay,
    fetchGlampingUnits,
    createReservationAndRedirect
  };
};
