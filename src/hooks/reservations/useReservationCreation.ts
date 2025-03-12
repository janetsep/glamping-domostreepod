
import { useCallback } from 'react';
import { packageData } from '@/components/packages/packageData';
import { supabase } from '@/lib/supabase';
import { isPackageUnit } from './utils/packageUnitChecker';
import { calculateActivitiesTotal, calculatePackagesTotal, calculateFinalTotal } from './utils/priceCalculator';
import { createReservationEntry, createTemporaryReservation } from './utils/supabaseUtils';

const SUPABASE_URL = 'https://gtxjfmvnzrsuaxryffnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8';

interface UseReservationCreationProps {
  setIsLoading: (isLoading: boolean) => void;
  toast: any;
  checkAvailability: (unitId: string, checkIn: Date, checkOut: Date) => Promise<boolean>;
}

export const useReservationCreation = ({ 
  setIsLoading, 
  toast,
  checkAvailability 
}: UseReservationCreationProps) => {
  const createReservation = useCallback(async (
    unitId: string,
    checkIn: Date,
    checkOut: Date,
    guests: number,
    totalPrice: number,
    paymentMethod: string = 'webpay',
    selectedActivities: string[] = [],
    selectedPackages: string[] = []
  ) => {
    setIsLoading(true);
    try {
      // Check availability first
      const isAvailable = await checkAvailability(unitId, checkIn, checkOut);
      if (!isAvailable) {
        toast({
          variant: "destructive",
          title: "No disponible",
          description: "Lo sentimos, las fechas seleccionadas no están disponibles.",
        });
        return null;
      }

      // Calculate pricing for activities and packages
      const activitiesTotal = await calculateActivitiesTotal(selectedActivities);
      const packagesTotal = await calculatePackagesTotal(selectedPackages);
      const finalTotalPrice = calculateFinalTotal(totalPrice, activitiesTotal, packagesTotal);

      // Create reservation based on unit type
      let reservationData;
      if (isPackageUnit(unitId)) {
        console.log('Creando reserva temporal para unidad de paquete');
        reservationData = createTemporaryReservation(
          unitId,
          checkIn,
          checkOut,
          guests,
          finalTotalPrice,
          paymentMethod,
          selectedActivities,
          selectedPackages
        );
      } else {
        console.log('Creando reserva en la base de datos');
        console.log('Datos de reserva:', {
          unit_id: unitId,
          check_in: checkIn.toISOString(),
          check_out: checkOut.toISOString(),
          guests,
          total_price: finalTotalPrice,
          status: 'pending',
          payment_method: paymentMethod,
          selected_activities: selectedActivities,
          selected_packages: selectedPackages
        });
        
        reservationData = await createReservationEntry(
          unitId,
          checkIn,
          checkOut,
          guests,
          finalTotalPrice,
          paymentMethod,
          selectedActivities,
          selectedPackages
        );
      }
      
      toast({
        title: "Reserva iniciada",
        description: "Tu reserva se ha creado y ahora serás redirigido a Webpay para completar el pago",
      });

      return reservationData;
    } catch (error) {
      console.error('Error al crear reserva:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la reserva. Por favor, inténtalo de nuevo.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [checkAvailability, setIsLoading, toast]);

  return { createReservation };
};
