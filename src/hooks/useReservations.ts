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
          name: 'Cabaña del Bosque',
          description: 'Una hermosa cabaña con vista al bosque nativo, perfecta para escapadas románticas.',
          max_guests: 2,
          price_per_night: 150000,
          image_url: 'https://images.unsplash.com/photo-1618767689160-da3fb810aad7'
        },
        {
          name: 'Domo Familiar',
          description: 'Espacioso domo geodésico con todas las comodidades para una experiencia familiar única.',
          max_guests: 4,
          price_per_night: 200000,
          image_url: 'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb'
        },
        {
          name: 'Suite Lago',
          description: 'Lujosa suite con vista panorámica al lago, ideal para parejas que buscan tranquilidad.',
          max_guests: 2,
          price_per_night: 180000,
          image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'
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
      
      const { data: existingReservations, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('unit_id', unitId)
        .eq('status', 'confirmed')
        .or(`check_in.lte.${checkOut.toISOString()},check_out.gte.${checkIn.toISOString()}`);

      if (error) throw error;

      // Si no hay reservaciones que se superpongan, está disponible
      return !existingReservations || existingReservations.length === 0;
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
    totalPrice: number
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
          status: 'confirmed'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al crear reserva:', errorText);
        throw new Error(`Error al crear reserva: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      toast({
        title: "Reserva creada",
        description: "Tu reserva se ha creado exitosamente",
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

  return {
    isLoading,
    fetchGlampingUnits,
    createReservation,
    checkAvailability,
    calculateQuote
  };
};
