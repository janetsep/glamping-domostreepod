import { useCallback } from 'react';
import { packageData } from '@/components/packages/packageData';
import { supabase } from '@/lib/supabase';
import { isPackageUnit } from './utils/packageUnitChecker';
import { calculateActivitiesTotal, calculatePackagesTotal, calculateFinalTotal } from './utils/priceCalculator';
import { createReservationEntry, createTemporaryReservation } from './utils/supabaseUtils';
import { toast } from '@/components/ui/use-toast';
import { AvailabilityManager } from './utils/availabilityManager';

const SUPABASE_URL = 'https://gtxjfmvnzrsuaxryffnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8';

interface UseReservationCreationProps {
  setIsLoading: (isLoading: boolean) => void;
  toast: any;
  checkAvailability: (unitId: string, checkIn: Date, checkOut: Date, guests: number, requiredDomos: number) => Promise<boolean>;
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
    selectedPackages: string[] = [],
    requiredDomos: number
  ) => {
    setIsLoading(true);
    try {
      // La función checkAvailability en AvailabilityManager ahora espera guests y dateRange, no unitId ni requiredDomos
      // También retorna un objeto con isAvailable, availableDomes, requiredDomes, error, availableUnitIds
      const availabilityManager = AvailabilityManager.getInstance();
      const availabilityResult = await availabilityManager.checkAvailability(
        guests, 
        { start: checkIn, end: checkOut }
      );
      
      const { isAvailable, availableUnitIds, requiredDomes } = availabilityResult;
      console.log('🔄 [useReservationCreation] Resultado de checkAvailability:', availabilityResult);

      if (!isAvailable) {
        toast({
          title: 'Error de Disponibilidad',
          description: availabilityResult.error || 'No hay suficiente disponibilidad para las fechas seleccionadas.',
          variant: 'destructive',
        });
        return null; // O lanzar un error específico
      }

      // Calculate pricing for activities and packages
      const activitiesTotal = await calculateActivitiesTotal(selectedActivities);
      const packagesTotal = await calculatePackagesTotal(selectedPackages);
      const finalTotalPrice = calculateFinalTotal(totalPrice, activitiesTotal, packagesTotal);

      // CORRECCIÓN: Siempre crear una entrada de reserva real en la base de datos
      console.log('Creando reserva en la base de datos');
      console.log('Datos de reserva:', {
        check_in: checkIn.toISOString(),
        check_out: checkOut.toISOString(),
        guests,
        total_price: finalTotalPrice,
        status: 'pending', // Estado inicial pendiente
        payment_method: paymentMethod,
        selected_activities: selectedActivities,
        selected_packages: selectedPackages,
        availableUnitIds: availableUnitIds.slice(0, requiredDomos) // Pasar los IDs de domo disponibles a asignar
      });

      // La función createReservationEntry ahora debe aceptar availableUnitIds
      // y crear múltiples registros si es necesario
      const reservation = await createReservationEntry(
        availableUnitIds.slice(0, requiredDomos), // Pasar los IDs de domo disponibles a asignar
        checkIn,
        checkOut,
        guests,
        finalTotalPrice,
        paymentMethod,
        selectedActivities,
        selectedPackages
        // TODO: createReservationEntry necesita aceptar is_package_unit si se usa en el backend
      );
      
      if (reservation) {
         toast({
           title: "Reserva iniciada",
           description: "Tu reserva se ha creado y ahora serás redirigido a Webpay para completar el pago",
         });
      }

      // createReservationEntry retorna un array de objetos insertados.
      // Para el flujo de pago, necesitamos el ID de la reserva principal y el monto total.
      // Usaremos el ID del primer registro insertado como el ID principal de la reserva.
      if (reservation && Array.isArray(reservation) && reservation.length > 0) {
        const primaryReservationId = reservation[0].id; // Asumiendo que el primer elemento tiene la propiedad 'id'
        console.log('✅ [useReservationCreation] Reserva principal creada con ID:', primaryReservationId);
        // Retornar el ID de la reserva principal y el monto total para el flujo de pago
        return { reservationId: primaryReservationId, amount: finalTotalPrice };
      } else {
        console.error('❌ [useReservationCreation] createReservationEntry no retornó un array válido de reservas.', reservation);
        throw new Error('Error al obtener ID de reserva después de la creación.');
      }

    } catch (error) {
      console.error('❌ [useReservationCreation] Error al crear reserva:', error);
      toast({
        title: 'Error al crear reserva',
        description: 'Hubo un problema al intentar crear la reserva. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [checkAvailability, setIsLoading, toast]);

  return { createReservation };
};
