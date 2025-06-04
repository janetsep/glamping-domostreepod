
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useGlampingUnits } from './useGlampingUnits';
import { AvailabilityManager } from './utils/availabilityManager';
import { ReservationQueue } from './utils/reservationQueue';
import { v4 as uuidv4 } from 'uuid';
import { Activity, ThemedPackage } from '@/types';

export const useReservations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4()); // ID único para la sesión actual
  const { toast } = useToast();

  // Obtener instancias de los managers
  const availabilityManager = AvailabilityManager.getInstance();
  console.log('🔍 [useReservations] AvailabilityManager instancia obtenida.', availabilityManager);
  const reservationQueue = ReservationQueue.getInstance();

  // Compose all the sub-hooks
  const { fetchGlampingUnits } = useGlampingUnits({ setIsLoading, toast });

  // Verificar disponibilidad
  const checkAvailability = useCallback(async (
    guests: number,
    checkIn: Date,
    checkOut: Date,
    forceRefresh: boolean = false
  ) => {
    try {
      const result = await availabilityManager.checkAvailability(
        guests,
        { start: checkIn, end: checkOut },
        forceRefresh
      );

      if (!result.isAvailable && result.error) {
        toast({
          variant: "destructive",
          title: "No disponible",
          description: result.error
        });
      }

      return result;
    } catch (error) {
      console.error('Error checking availability:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al verificar disponibilidad"
      });
      return { isAvailable: false, availableDomes: 0, requiredDomes: 0, error: 'Error al verificar disponibilidad' };
    }
  }, [toast]);

  // Crear reserva
  const createReservation = useCallback(async (
    unitId: string,
    checkIn: Date,
    checkOut: Date,
    guests: number,
    totalPrice: number,
    paymentMethod: string = 'webpay',
    selectedActivities: Activity[] = [],
    selectedPackages: ThemedPackage[] = []
  ) => {
    setIsLoading(true);
    try {
      // Verificar disponibilidad primero
      const result = await checkAvailability(guests, checkIn, checkOut, true);
      if (!result.isAvailable) {
        return null;
      }

      // Preparar datos de la reserva
      const request = {
        unitId,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        sessionId,
        activities: selectedActivities.map(a => a.id),
        packages: selectedPackages.map(p => p.id)
      };

      // Encolar la reserva
      const { queueId, status, error } = await reservationQueue.enqueueReservation(request);

      if (status === 'error' || !queueId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "No se pudo procesar la reserva"
        });
        return null;
      }

      // Esperar a que la reserva se procese
      let attempts = 0;
      const maxAttempts = 10;
      const checkInterval = 1000; // 1 segundo

      while (attempts < maxAttempts) {
        const queueItem = reservationQueue.getQueueItemStatus(queueId);
        
        if (!queueItem) {
          throw new Error('Reserva no encontrada en la cola');
        }

        if (queueItem.status === 'completed') {
          toast({
            title: "Reserva iniciada",
            description: "Tu reserva se ha creado y ahora serás redirigido a Webpay para completar el pago"
          });
          return {
            reservationId: queueId,
            amount: totalPrice,
            reservationCode: queueId.substring(0, 6).toUpperCase()
          };
        }

        if (queueItem.status === 'failed') {
          throw new Error(queueItem.error || 'Error al procesar la reserva');
        }

        await new Promise(resolve => setTimeout(resolve, checkInterval));
        attempts++;
      }

      throw new Error('Tiempo de espera agotado al procesar la reserva');

    } catch (error) {
      console.error('Error al crear reserva:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear la reserva"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [checkAvailability, sessionId, toast]);

  // Calcular cotización
  const calculateQuote = useCallback((
    unitPrices: any,
    checkIn: Date,
    checkOut: Date,
    guests: number,
    requiredDomos: number = 1
  ) => {
    // Implementación básica del cálculo de cotización
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = unitPrices.base_price || 50000;
    const totalPrice = basePrice * nights * requiredDomos;
    
    return {
      nights,
      pricePerNight: basePrice,
      basePrice: totalPrice,
      totalPrice,
      breakdown: [],
      rateDescription: 'Tarifa estándar',
      requiredDomos,
      domoDistribution: [],
      season: null
    };
  }, []);

  // Redirigir a WebPay
  const redirectToWebpay = useCallback(async (
    reservationId: string,
    totalPrice: number,
    isPackageUnit: boolean = false,
    unitId?: string
  ) => {
    // Implementación básica de redirección a WebPay
    console.log('Redirecting to WebPay:', { reservationId, totalPrice, isPackageUnit, unitId });
    // Aquí iría la lógica real de redirección
  }, []);

  // Limpiar recursos al desmontar
  const cleanup = useCallback(() => {
    availabilityManager.cleanup();
    reservationQueue.cleanup();
  }, []);

  return {
    isLoading,
    fetchGlampingUnits,
    createReservation,
    checkAvailability,
    calculateQuote,
    redirectToWebpay,
    cleanup
  };
};
