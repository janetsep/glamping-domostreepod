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
      console.log('🚀 [useReservationCreation] Iniciando creación de reserva:', {
        unitIds,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
        totalPrice,
        requiredDomos,
        availableUnitIds
      });

      // Calcular el número correcto de domos necesarios
      const calculatedRequiredDomos = Math.ceil(guests / 4);
      const finalRequiredDomos = requiredDomos || Math.max(calculatedRequiredDomos, 1);

      // NUEVO: Siempre vamos a buscar los domos disponibles si los param vienen vacíos o no alcanzan
      let unitsToCreate: string[];

      // Si llega disponible la lista de unidades válidas y es suficiente, usarla.
      if (availableUnitIds && availableUnitIds.length >= finalRequiredDomos) {
        unitsToCreate = availableUnitIds.slice(0, finalRequiredDomos);
        console.log('✅ [useReservationCreation] Usando unidades pre-verificadas:', unitsToCreate);
      } else if (Array.isArray(unitIds) && unitIds.length >= finalRequiredDomos) {
        unitsToCreate = unitIds.slice(0, finalRequiredDomos);
        console.log('✅ [useReservationCreation] Usando unitIds (array):', unitsToCreate);
      } else {
        // Buscar unidades disponibles en base de datos
        console.log('🔍 [useReservationCreation] Buscando Unidades Disponibles desde base de datos...');
        // Consultar glamping_units y reservas existentes
        const { data: allUnits, error: unitsError } = await supabase
          .from('glamping_units')
          .select('id')
          .order('id', { ascending: true });

        if (unitsError || !allUnits || allUnits.length === 0) {
          throw new Error('No se encontraron unidades disponibles para reservar');
        }

        // Verificar contra las reservas traslapadas
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
        const { data: conflictingReservations, error: reservationsError } = await supabase
          .from('reservations')
          .select('unit_id')
          .in('unit_id', allUnits.map(u => u.id))
          .or(`and(check_in.lt.${checkOut.toISOString()},check_out.gt.${checkIn.toISOString()})`)
          .or(`status.eq.confirmed,and(status.eq.pending,created_at.gte.${fifteenMinutesAgo})`);

        if (reservationsError) throw new Error('Error al verificar disponibilidad');

        const reservedUnitIds = new Set(
          conflictingReservations?.filter(r => r.unit_id !== null && r.unit_id !== undefined)
            .map(r => String(r.unit_id)) || []
        );

        const availableUnits = allUnits.filter(unit => !reservedUnitIds.has(String(unit.id)));

        if (availableUnits.length < finalRequiredDomos) {
          throw new Error(`No hay suficientes domos disponibles. Se requieren ${finalRequiredDomos}, hay solo ${availableUnits.length}.`);
        }

        unitsToCreate = availableUnits.slice(0, finalRequiredDomos).map(unit => unit.id);
        console.log('✅ [useReservationCreation] Unidades seleccionadas desde base de datos:', unitsToCreate);
      }

      console.log('✅ [useReservationCreation] Unidades finales para crear reservas:', {
        unidades: unitsToCreate,
        totalUnidades: unitsToCreate.length,
        requiredDomos: finalRequiredDomos
      });

      // Llamada a crear todas las reservas (1 por domo)
      const reservation = await createReservationEntry(
        unitsToCreate,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        paymentMethod,
        selectedActivities,
        selectedPackages,
        clientInfo
      );

      if (reservation && Array.isArray(reservation) && reservation.length > 0) {
        const primaryReservationId = reservation[0].id;
        const resultData = {
          reservationId: primaryReservationId,
          amount: totalPrice,
          reservationCode: reservation[0].reservation_code
        };

        // Callback onSuccess
        if (onSuccess) onSuccess(resultData);

        toast({
          title: "Reserva iniciada",
          description: `Tu reserva de ${reservation.length} domo(s) se ha creado y ahora serás redirigido a Webpay para completar el pago`
        });

        return resultData;
      } else {
        throw new Error('Error al obtener ID de reserva después de la creación.');
      }
    } catch (error) {
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
  }, [toast, onSuccess, onError]);

  return {
    createReservation,
    isLoading
  };
};
