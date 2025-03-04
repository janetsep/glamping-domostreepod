import { useState, useCallback } from 'react';
import { supabase, type Reservation, type GlampingUnit } from '@/lib/supabase';

const SUPABASE_URL = 'https://gtxjfmvnzrsuaxryffnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8';

import { useToast, clearAllToasts } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

export const useReservations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchGlampingUnits = useCallback(async () => {
    try {
      console.log('Iniciando fetchGlampingUnits');
      const { data, error } = await supabase
        .from('glamping_units')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error en la consulta:', error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log('Unidades encontradas:', data.length);
        return data as GlampingUnit[];
      }

      console.log('No se encontraron unidades, usando datos de packageData');
      // Fallback to packageData
      return [];
    } catch (error) {
      console.error('Error en fetchGlampingUnits:', error);
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudieron cargar las unidades. Por favor, intenta de nuevo más tarde.",
      });
      return [];
    }
  }, [toast]);

  const checkAvailability = async (
    unitId: string,
    checkIn: Date,
    checkOut: Date
  ) => {
    try {
      setIsLoading(true);
      console.log(`Verificando disponibilidad para unidad ${unitId} del ${checkIn.toISOString()} al ${checkOut.toISOString()}`);
      
      const { data: existingReservations, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('unit_id', unitId)
        .eq('status', 'confirmed')
        .or(`check_in.lt.${checkOut.toISOString()},check_out.gt.${checkIn.toISOString()}`);

      if (error) {
        console.error('Error al verificar disponibilidad:', error);
        throw error;
      }

      console.log('Reservaciones encontradas:', existingReservations?.length || 0);
      return existingReservations?.length === 0; // Return true if no overlapping reservations
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo verificar la disponibilidad. Por favor, intenta de nuevo.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateQuote = (
    unitPrices: GlampingUnit['prices'],
    checkIn: Date,
    checkOut: Date,
    guests: number
  ) => {
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = (unitPrices.base_price || 120000) * nights;
    
    return {
      nights,
      pricePerNight: unitPrices.base_price || 120000,
      basePrice,
      totalPrice: basePrice,
      breakdown: [
        { description: `${nights} noches x $${(unitPrices.base_price || 120000).toLocaleString()}`, amount: basePrice }
      ]
    };
  };

  const createReservation = async (
    unitId: string,
    checkIn: Date,
    checkOut: Date,
    guests: number,
    totalPrice: number,
    paymentMethod: string = 'webpay'
  ) => {
    setIsLoading(true);
    try {
      const isAvailable = await checkAvailability(unitId, checkIn, checkOut);
      if (!isAvailable) {
        toast({
          variant: "destructive",
          title: "No disponible",
          description: "Lo sentimos, las fechas seleccionadas no están disponibles.",
        });
        return null;
      }

      const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          unit_id: unitId,
          check_in: checkIn.toISOString(),
          check_out: checkOut.toISOString(),
          guests,
          total_price: totalPrice,
          status: 'pending',
          payment_method: paymentMethod
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al crear reserva:', errorText);
        throw new Error(`Error al crear reserva: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      toast({
        title: "Reserva iniciada",
        description: "Tu reserva se ha creado y ahora serás redirigido a Webpay para completar el pago",
      });

      return data[0] as Reservation;
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
  };

  const redirectToWebpay = async (reservationId: string, amount: number) => {
    console.log(`Iniciando proceso WebPay para la reserva ${reservationId} por $${amount}`);
    
    try {
      setIsLoading(true);
      clearAllToasts();
      sonnerToast.dismiss();
      
      const origin = window.location.origin;
      const requestData = {
        reservationId,
        amount,
        origin
      };
      
      const initResponse = await fetch(`${SUPABASE_URL}/functions/v1/webpay-init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(requestData)
      });

      const responseText = await initResponse.text();
      let transactionData;
      try {
        transactionData = JSON.parse(responseText);
      } catch (e) {
        console.error(`Error al parsear respuesta JSON: ${e.message}`);
        return {
          status: 'error',
          message: 'Error al parsear respuesta',
          details: null
        };
      }

      if (!initResponse.ok || transactionData.error) {
        const errorMessage = transactionData.error || `Error HTTP: ${initResponse.status}`;
        console.error(`Error al iniciar transacción: ${errorMessage}`);
        return {
          status: 'error',
          message: errorMessage,
          details: null
        };
      }

      if (!transactionData.url || !transactionData.token) {
        console.error(`Respuesta incompleta de WebPay: ${JSON.stringify(transactionData)}`);
        return {
          status: 'error',
          message: 'Respuesta incompleta de WebPay',
          details: null
        };
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = transactionData.url;
      form.style.display = 'none';
      
      const tokenField = document.createElement('input');
      tokenField.type = 'hidden';
      tokenField.name = 'token_ws';
      tokenField.value = transactionData.token;
      form.appendChild(tokenField);
      
      document.body.appendChild(form);
      setTimeout(() => {
        form.submit();
      }, 10);
      
      return {
        status: 'pending',
        message: 'Redirigiendo a WebPay Plus',
        details: {
          token: transactionData.token,
          url: transactionData.url
        }
      };
    } catch (error) {
      console.error(`Error en el proceso de pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido en el proceso de pago',
        details: null
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchGlampingUnits,
    createReservation,
    checkAvailability,
    calculateQuote,
    redirectToWebpay
  };
};
