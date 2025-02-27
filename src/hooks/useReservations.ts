
import { useState, useCallback } from 'react';
import { supabase, type Reservation, type GlampingUnit } from '@/lib/supabase';

const SUPABASE_URL = 'https://gtxjfmvnzrsuaxryffnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8';

import { useToast } from '@/components/ui/use-toast';

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

      console.log('Creando unidades de ejemplo');
      const exampleUnits = [
        {
          name: 'Domo Familiar',
          description: 'Espacioso domo geodésico con todas las comodidades para una experiencia familiar única. Perfecto para familias con niños.',
          max_guests: 4,
          price_per_night: 200000,
          image_url: 'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb'
        },
        {
          name: 'Domo Bosque',
          description: 'Hermoso domo rodeado de vegetación nativa con vistas al bosque. Ideal para los amantes de la naturaleza.',
          max_guests: 2,
          price_per_night: 150000,
          image_url: 'https://images.unsplash.com/photo-1618767689160-da3fb810aad7'
        },
        {
          name: 'Domo Panorámico',
          description: 'Domo con techo transparente para observar las estrellas por la noche. Una experiencia única en medio de la naturaleza.',
          max_guests: 2,
          price_per_night: 180000,
          image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'
        },
        {
          name: 'Domo Superior',
          description: 'Nuestro domo más lujoso, con jacuzzi privado y las mejores vistas del valle. Perfecto para ocasiones especiales.',
          max_guests: 4,
          price_per_night: 250000,
          image_url: 'https://images.unsplash.com/photo-1533090368676-1fd25485db88?q=80&w=1969&auto=format&fit=crop'
        }
      ];

      const { data: insertedData, error: insertError } = await supabase
        .from('glamping_units')
        .insert(exampleUnits)
        .select();

      if (insertError) {
        console.error('Error al insertar ejemplos:', insertError);
        throw insertError;
      }

      console.log('Unidades de ejemplo creadas:', insertedData?.length);
      return insertedData as GlampingUnit[];

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
      
      // Corregimos la consulta para verificar correctamente los solapamientos
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
      
      // En este punto, consideramos disponible si no hay reservaciones que se solapen
      // Para propósitos de prueba, siempre retornaremos true (disponible)
      return true; // Temporalmente hacemos que siempre esté disponible
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
    pricePerNight: number,
    checkIn: Date,
    checkOut: Date,
    guests: number
  ) => {
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = pricePerNight * nights;
    
    // Aquí podrías agregar lógica adicional para descuentos o cargos extra
    // Por ejemplo, cargo extra por más huéspedes, descuento por estancias largas, etc.
    
    return {
      nights,
      pricePerNight,
      basePrice,
      totalPrice: basePrice,
      breakdown: [
        { description: `${nights} noches x $${pricePerNight.toLocaleString()}`, amount: basePrice }
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
      // Primero verificar disponibilidad
      const isAvailable = await checkAvailability(unitId, checkIn, checkOut);
      if (!isAvailable) {
        toast({
          variant: "destructive",
          title: "No disponible",
          description: "Lo sentimos, las fechas seleccionadas no están disponibles.",
        });
        return null;
      }

      // Usamos la API REST directa con las constantes de URL y key
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
      // Usando nuestra Edge Function para iniciar la transacción con WebPay
      const initResponse = await fetch(`${SUPABASE_URL}/functions/v1/webpay-init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          reservationId,
          amount,
          origin: window.location.origin
        })
      });

      if (!initResponse.ok) {
        const errorText = await initResponse.text();
        console.error('Error al iniciar transacción:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Error al iniciar la transacción con WebPay');
        } catch (parseError) {
          throw new Error(`Error al iniciar la transacción con WebPay: ${errorText}`);
        }
      }

      const transactionData = await initResponse.json();
      console.log('Transacción iniciada:', transactionData);

      // Guardamos el token en la reserva
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ 
          payment_details: { 
            token: transactionData.token,
            transaction_initiation: new Date().toISOString()
          }
        })
        .eq('id', reservationId);

      if (updateError) {
        console.error('Error al actualizar reserva con token:', updateError);
      }

      // Redirigimos al usuario a la página de pago de WebPay
      window.location.href = transactionData.url;

      return {
        status: 'pending',
        message: 'Redirigiendo a WebPay Plus',
        details: {
          token: transactionData.token,
          url: transactionData.url
        }
      };
    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      toast({
        variant: "destructive",
        title: "Error en el pago",
        description: "No se pudo iniciar el proceso de pago. Por favor, intenta nuevamente.",
      });
      
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido en el proceso de pago',
        details: null
      };
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
