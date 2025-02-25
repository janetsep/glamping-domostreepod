
import { useState } from 'react';
import { supabase, type Reservation, type GlampingUnit } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useReservations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchGlampingUnits = async () => {
    setIsLoading(true);
    try {
      console.log('Iniciando fetch de unidades...');
      
      const { data, error } = await supabase
        .from('glamping_units')
        .select('*');

      console.log('Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('Error detallado:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `No se pudieron cargar las unidades: ${error.message}`,
        });
        return [];
      }

      if (!data || data.length === 0) {
        console.log('No hay datos, intentando insertar ejemplos...');
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
          toast({
            variant: "destructive",
            title: "Error",
            description: `No se pudieron crear las unidades de ejemplo: ${insertError.message}`,
          });
          return [];
        }

        console.log('Datos de ejemplo insertados:', insertedData);
        return insertedData as GlampingUnit[];
      }

      console.log('Datos obtenidos correctamente:', data);
      return data as GlampingUnit[];
    } catch (error) {
      console.error('Error completo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al cargar las unidades",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
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
      const { data, error } = await supabase
        .from('reservations')
        .insert([
          {
            unit_id: unitId,
            check_in: checkIn.toISOString(),
            check_out: checkOut.toISOString(),
            guests,
            total_price: totalPrice,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Reserva creada",
        description: "Tu reserva se ha creado exitosamente",
      });

      return data as Reservation;
    } catch (error) {
      console.error('Error al crear reserva:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la reserva",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchGlampingUnits,
    createReservation
  };
};
