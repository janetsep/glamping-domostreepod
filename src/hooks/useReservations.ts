
import { useState } from 'react';
import { supabase, type Reservation, type GlampingUnit } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useReservations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchGlampingUnits = async () => {
    const { data, error } = await supabase
      .from('glamping_units')
      .select('*');

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las unidades de glamping",
      });
      return [];
    }

    return data as GlampingUnit[];
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
