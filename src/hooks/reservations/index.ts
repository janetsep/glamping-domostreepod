
import { useState } from 'react';
import { useAvailabilityCheck } from './useAvailabilityCheck';
import { usePricing } from './usePricing';
import { useReservationCreation } from './useReservationCreation';
import { usePayment } from './usePayment';
import { useGlampingUnits } from './useGlampingUnits';
import { useToast } from '@/components/ui/use-toast';
import { Activity, ThemedPackage } from '@/types';
import { AvailabilityManager } from "./utils/availabilityManager";
import { ReservationQueue } from "./utils/reservationQueue";

export const useReservations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Obtener instancias de los managers
  const availabilityManager = AvailabilityManager.getInstance();
  const reservationQueue = ReservationQueue.getInstance();

  // Crear una función adaptadora para checkAvailability que coincida con la firma esperada por useReservationCreation
  const checkAvailabilityForCreation = async (
    unitId: string,
    checkIn: Date,
    checkOut: Date,
    guests: number,
    requiredDomos: number
  ): Promise<boolean> => {
    const result = await availabilityManager.checkAvailability(
      guests,
      { start: checkIn, end: checkOut }
    );

    return result.isAvailable;
  };
  
  const { calculateQuote } = usePricing();
  const { createReservation } = useReservationCreation({ 
    onSuccess: () => {},
    onError: () => {}
  });
  const { redirectToWebpay } = usePayment({ setIsLoading });
  const { fetchGlampingUnits } = useGlampingUnits({ setIsLoading, toast });
  
  const createReservationAndRedirect = async (
    unitId: string,
    checkIn: Date,
    checkOut: Date,
    guests: number,
    totalPrice: number,
    selectedActivities: Activity[] = [],
    selectedPackages: ThemedPackage[] = [],
    requiredDomos: number
  ) => {
    setIsLoading(true);
    
    try {
      const activityIds = selectedActivities.map(a => a.id);
      const packageIds = selectedPackages.map(p => p.id);
      
      const reservation = await createReservation(
        unitId,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        'webpay',
        activityIds,
        packageIds,
        requiredDomos
      );
      
      if (reservation && reservation.reservationId) {
        await redirectToWebpay(reservation.reservationId, totalPrice, false, unitId);
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
    checkAvailability: (guests, startDate, endDate, forceRefresh) =>
      availabilityManager.checkAvailability(guests, { start: startDate, end: endDate }, forceRefresh),
      
    checkGeneralAvailability: (startDate, endDate, requiredDomos) => 
      availabilityManager.checkAvailability(requiredDomos * 4, { start: startDate, end: endDate }),
      
    calculateQuote,
    createReservation,
    redirectToWebpay,
    fetchGlampingUnits,
    createReservationAndRedirect
  };
};
