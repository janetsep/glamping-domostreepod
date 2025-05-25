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
import { v4 as uuidv4 } from 'uuid';

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
    // Aquí necesitamos obtener el número de huéspedes requeridos.
    // Ya no usaremos valores fijos, sino los que se pasen a la función.
    // TODO: Asegurarse de que el número de huéspedes/domos requerido correcto se pase a esta función.

    // Llamar a la función checkAvailability del AvailabilityManager
    const result = await availabilityManager.checkAvailability(
      guests, // Pasar el número de huéspedes recibido
      { start: checkIn, end: checkOut } // Pasar el rango de fechas
    );

    // Retornar solo el booleano isAvailable para coincidir con la firma esperada
    return result.isAvailable;
  };
  
  const { calculateQuote } = usePricing();
  const { createReservation } = useReservationCreation({ 
    setIsLoading, 
    toast,
    checkAvailability: checkAvailabilityForCreation
  });
  const { redirectToWebpay } = usePayment({ setIsLoading });
  // Fix: Pass both required parameters to useGlampingUnits
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
        packageIds,
        requiredDomos
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
    checkAvailability: (guests, startDate, endDate, forceRefresh) =>
      availabilityManager.checkAvailability(guests, { start: startDate, end: endDate }, forceRefresh),
      
    checkGeneralAvailability: (startDate, endDate, requiredDomos) => 
      availabilityManager.checkAvailability(requiredDomos * 4, { start: startDate, end: endDate }), // Asumiendo 4 huéspedes por domo
      
    calculateQuote,
    createReservation,
    redirectToWebpay,
    fetchGlampingUnits,
    createReservationAndRedirect
  };
};
