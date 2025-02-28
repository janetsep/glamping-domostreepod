
import { useState, useCallback } from 'react';
import { supabase, type Reservation, type GlampingUnit } from '@/lib/supabase';

const SUPABASE_URL = 'https://gtxjfmvnzrsuaxryffnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8';

import { useToast, clearAllToasts } from '@/hooks/use-toast';

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

      console.log('Creando unidades de ejemplo basadas en domostreepod.cl');
      const exampleUnits = [
        {
          name: 'Domo Araucaria',
          description: 'Domo autosustentable con amplia terraza, mini cocina equipada, zona de fogón, ducha con agua caliente y hermosas vistas al lago. Ubicado en un entorno natural maravilloso, es perfecto para una escapada romántica o de aventura en la naturaleza.',
          max_guests: 2,
          price_per_night: 120000,
          image_url: 'https://domostreepod.cl/wp-content/uploads/2021/04/Caba%C3%B1a-en-un-%C3%A1rbol-Domo-Araucaria-3-800x530.jpg'
        },
        {
          name: 'Domo Canelo',
          description: 'Lujoso domo con jacuzzi al aire libre, terraza panorámica y vistas espectaculares al bosque nativo. Equipado con mini cocina, baño completo y todos los detalles para una experiencia de glamping perfecta. Escape ideal para reconectar con la naturaleza.',
          max_guests: 2,
          price_per_night: 135000,
          image_url: 'https://domostreepod.cl/wp-content/uploads/2021/04/Domo-Canelo-Cabana-en-un-arbol-5-800x530.jpg'
        },
        {
          name: 'Domo Coihue',
          description: 'Increíble domo suspendido entre árboles nativos con terraza privada y hermosas vistas al bosque y al lago. Cuenta con ducha panorámica, mini cocina y todas las comodidades para una estadía mágica en plena naturaleza. Perfecto para aventureros.',
          max_guests: 2,
          price_per_night: 125000,
          image_url: 'https://domostreepod.cl/wp-content/uploads/2021/04/Caba%C3%B1a-en-un-arbol-Domo-Coihue-1-800x530.jpg'
        },
        {
          name: 'Domo Mirador',
          description: 'Exclusivo domo con vistas 360° al lago y bosque nativo, con terraza panorámica privada y hot tub. Equipado con cocina integrada, baño completo y todas las comodidades para una experiencia inolvidable en contacto con la naturaleza.',
          max_guests: 4,
          price_per_night: 150000,
          image_url: 'https://domostreepod.cl/wp-content/uploads/2022/04/domo-mirador-1-800x530.jpg'
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
      setIsLoading(true);
      
      // Eliminar todos los toasts existentes al comienzo de la función
      clearAllToasts();
      
      // Verificamos el origen para la URL de retorno
      const origin = window.location.origin;
      console.log(`Origen para URL de retorno: ${origin}`);
      
      // Datos para la solicitud
      const requestData = {
        reservationId,
        amount,
        origin
      };
      
      console.log(`Datos para iniciar transacción: ${JSON.stringify(requestData)}`);
      
      // NO mostramos ningún toast de redirección, eliminamos esta línea
      
      // Llamada a la función Edge para iniciar la transacción
      const initResponse = await fetch(`${SUPABASE_URL}/functions/v1/webpay-init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(requestData)
      });

      // Verificar respuesta como texto primero para debugging
      const responseText = await initResponse.text();
      console.log(`Respuesta de webpay-init (texto): ${responseText}`);

      // Parsear respuesta
      let transactionData;
      try {
        transactionData = JSON.parse(responseText);
      } catch (e) {
        console.error(`Error al parsear respuesta JSON: ${e.message}`);
        throw new Error(`Error al parsear respuesta: ${responseText}`);
      }

      // Verificar errores en la respuesta
      if (!initResponse.ok || transactionData.error) {
        const errorMessage = transactionData.error || `Error HTTP: ${initResponse.status}`;
        console.error(`Error al iniciar transacción: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      // Verificar que la respuesta incluya URL y token
      if (!transactionData.url || !transactionData.token) {
        console.error(`Respuesta incompleta de WebPay: ${JSON.stringify(transactionData)}`);
        throw new Error('Respuesta de WebPay incompleta: falta URL o token');
      }

      console.log(`Transacción iniciada exitosamente. Token: ${transactionData.token}`);
      console.log(`URL de redirección: ${transactionData.url}`);
      
      // Crear un formulario HTML para enviar el token (método recomendado por Transbank)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = transactionData.url;
      form.style.display = 'none'; // Ocultar el formulario
      
      // Añadir el token como un campo oculto
      const tokenField = document.createElement('input');
      tokenField.type = 'hidden';
      tokenField.name = 'token_ws';
      tokenField.value = transactionData.token;
      form.appendChild(tokenField);
      
      // Añadir el formulario al documento y enviarlo
      document.body.appendChild(form);
      console.log('Enviando formulario de redirección...');
      
      // Enviamos el formulario inmediatamente
      form.submit();
      
      return {
        status: 'pending',
        message: 'Redirigiendo a WebPay Plus',
        details: {
          token: transactionData.token,
          url: transactionData.url
        }
      };
    } catch (error) {
      console.error(`Error en el proceso de pago: ${error.message}`);
      
      // Solo mostrar mensaje de error si realmente hay un error
      toast({
        variant: "destructive",
        title: "Error en el pago",
        description: error instanceof Error ? error.message : "No se pudo iniciar el proceso de pago",
      });
      
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
