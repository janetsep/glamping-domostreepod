import { useState, useCallback } from 'react';
import { packageData } from '@/components/packages/packageData';
import { supabase } from '@/lib/supabase';
import { isPackageUnit } from './utils/packageUnitChecker';
import { calculateActivitiesTotal, calculatePackagesTotal, calculateFinalTotal } from './utils/priceCalculator';
import { createReservationEntry, createTemporaryReservation } from './utils/supabaseUtils';
import { toast } from '@/components/ui/use-toast';
import { AvailabilityManager } from './utils/availabilityManager';
import { useToast } from '@/components/ui/use-toast';

const SUPABASE_URL = 'https://gtxjfmvnzrsuaxryffnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8';

interface ClientInfo {
  name?: string;
  email?: string;
  phone?: string;
}

interface ReservationResult {
  reservationId: string;
  amount: number;
  reservationCode: string;
}

interface UseReservationCreationProps {
  onSuccess?: (data: ReservationResult) => void;
  onError?: (error: Error) => void;
}

export const useReservationCreation = ({ 
  onSuccess,
  onError 
}: UseReservationCreationProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createReservation = useCallback(async (
    unitIds: string | string[],
    checkIn: Date,
    checkOut: Date,
    guests: number,
    totalPrice: number,
    paymentMethod: string = 'webpay',
    selectedActivities: string[] = [],
    selectedPackages: string[] = [],
    requiredDomos?: number,
    availableUnitIds?: string[],
    clientInfo?: ClientInfo
  ) => {
    setIsLoading(true);

    try {
      const unitIdsToAssign = Array.isArray(unitIds) ? unitIds : [unitIds];
      
      console.log('🚀 [useReservationCreation] Iniciando creación de reserva:', {
        unitIdsToAssign,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
        totalPrice,
        requiredDomos,
        availableUnitIds
      });

      if (!availableUnitIds) {
        availableUnitIds = unitIdsToAssign;
      }

      if (!availableUnitIds || availableUnitIds.length < (requiredDomos || 1)) {
        throw new Error('No hay suficientes domos disponibles para las fechas seleccionadas');
      }

      console.log('✅ [useReservationCreation] Unidades asignadas:', availableUnitIds);

      const reservation = await createReservationEntry(
        availableUnitIds,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        paymentMethod,
        selectedActivities,
        selectedPackages,
        clientInfo
      );
      
      if (reservation) {
        console.log('✅ [useReservationCreation] Reservas creadas:', reservation);
        toast({
          title: "Reserva iniciada",
          description: "Tu reserva se ha creado y ahora serás redirigido a Webpay para completar el pago",
        });
      }

      if (reservation && Array.isArray(reservation) && reservation.length > 0) {
        const primaryReservationId = reservation[0].id;
        console.log('✅ [useReservationCreation] Reserva principal creada con ID:', primaryReservationId);
        return { 
          reservationId: primaryReservationId, 
          amount: totalPrice,
          reservationCode: reservation[0].reservation_code 
        };
      } else {
        console.error('❌ [useReservationCreation] createReservationEntry no retornó un array válido de reservas.', reservation);
        throw new Error('Error al obtener ID de reserva después de la creación.');
      }
    } catch (error) {
      console.error('❌ [useReservationCreation] Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear la reserva",
        variant: "destructive"
      });
      onError?.(error instanceof Error ? error : new Error('Error desconocido'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast, onError]);

  return {
    createReservation,
    isLoading
  };
};
