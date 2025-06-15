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

      console.log('📊 [useReservationCreation] Domos requeridos calculados:', {
        huéspedes: guests,
        domosCalculados: calculatedRequiredDomos,
        domosFinales: finalRequiredDomos,
        domosProporcionados: requiredDomos
      });

      // IMPORTANTE: Si unitIds está vacío o es un array vacío, 
      // realizar búsqueda completa de disponibilidad
      let unitsToCreate: string[];
      
      if (Array.isArray(unitIds) && unitIds.length === 0) {
        console.log('🔍 [useReservationCreation] Array de unidades vacío, buscando unidades disponibles...');
        
        // Obtener todas las unidades disponibles
        const { data: allUnits, error: unitsError } = await supabase
          .from('glamping_units')
          .select('id')
          .order('id', { ascending: true });

        if (unitsError) {
          console.error('❌ [useReservationCreation] Error al obtener unidades:', unitsError);
          throw new Error(`Error al obtener unidades: ${unitsError.message}`);
        }

        if (!allUnits || allUnits.length === 0) {
          console.error('❌ [useReservationCreation] No se encontraron unidades en la base de datos');
          throw new Error('No se encontraron unidades disponibles');
        }

        // Verificar disponibilidad contra reservas confirmadas Y pendientes recientes
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
        const { data: conflictingReservations, error: reservationsError } = await supabase
          .from('reservations')
          .select('unit_id')
          .in('unit_id', allUnits.map(u => u.id))
          .or(`and(check_in.lt.${checkOut.toISOString()},check_out.gt.${checkIn.toISOString()})`)
          .or(`status.eq.confirmed,and(status.eq.pending,created_at.gte.${fifteenMinutesAgo})`);

        if (reservationsError) {
          console.error('❌ [useReservationCreation] Error al verificar disponibilidad:', reservationsError);
          throw new Error(`Error al verificar disponibilidad: ${reservationsError.message}`);
        }

        // Filtrar unidades disponibles
        const reservedUnitIds = new Set(
          conflictingReservations?.filter(r => r.unit_id !== null && r.unit_id !== undefined)
            .map(r => String(r.unit_id)) || []
        );

        const availableUnits = allUnits.filter(unit => !reservedUnitIds.has(String(unit.id)));

        console.log('📊 [useReservationCreation] Análisis de disponibilidad completo:', {
          totalUnidades: allUnits.length,
          unidadesReservadas: reservedUnitIds.size,
          unidadesDisponibles: availableUnits.length,
          unidadesDisponiblesIds: availableUnits.map(u => u.id),
          requiredDomos: finalRequiredDomos
        });

        if (availableUnits.length < finalRequiredDomos) {
          console.error('❌ [useReservationCreation] No hay suficientes domos:', {
            disponibles: availableUnits.length,
            requeridos: finalRequiredDomos
          });
          throw new Error(`No hay suficientes domos disponibles. Se necesitan ${finalRequiredDomos} domos, pero solo hay ${availableUnits.length} disponibles.`);
        }

        // Seleccionar las primeras unidades disponibles
        unitsToCreate = availableUnits.slice(0, finalRequiredDomos).map(unit => unit.id);
        console.log('✅ [useReservationCreation] Unidades seleccionadas automáticamente:', unitsToCreate);
      } else if (availableUnitIds && availableUnitIds.length >= finalRequiredDomos) {
        // Usar unidades pre-verificadas
        unitsToCreate = availableUnitIds.slice(0, finalRequiredDomos);
        console.log('✅ [useReservationCreation] Usando unidades pre-verificadas:', unitsToCreate);
      } else {
        // Fallback: usar las unidades proporcionadas si es un string o array válido
        if (typeof unitIds === 'string') {
          unitsToCreate = [unitIds];
        } else if (Array.isArray(unitIds) && unitIds.length > 0) {
          unitsToCreate = unitIds.slice(0, finalRequiredDomos);
        } else {
          throw new Error('No se proporcionaron unidades válidas para la reserva');
        }
        console.log('✅ [useReservationCreation] Usando unidades proporcionadas:', unitsToCreate);
      }

      console.log('✅ [useReservationCreation] Unidades finales para crear reservas:', {
        unidades: unitsToCreate,
        totalUnidades: unitsToCreate.length,
        requiredDomos: finalRequiredDomos
      });

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
        
        console.log('✅ [useReservationCreation] Reservas múltiples creadas:', {
          reservaPrincipalId: primaryReservationId,
          totalReservas: reservation.length,
          unidades: reservation.map(r => ({ id: r.id, unitId: r.unit_id, guests: r.guests }))
        });
        
        // Ejecutar el callback de éxito ANTES de mostrar el toast
        if (onSuccess) {
          try {
            onSuccess(resultData);
            console.log('✅ [useReservationCreation] Callback onSuccess ejecutado exitosamente');
          } catch (callbackError) {
            console.error('❌ [useReservationCreation] Error en callback onSuccess:', callbackError);
            throw callbackError;
          }
        }
        
        toast({
          title: "Reserva iniciada",
          description: `Tu reserva de ${reservation.length} domo(s) se ha creado y ahora serás redirigido a Webpay para completar el pago`,
        });
        
        return resultData;
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
  }, [toast, onSuccess, onError]);

  return {
    createReservation,
    isLoading
  };
};
