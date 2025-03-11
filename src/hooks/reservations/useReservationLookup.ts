
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { formatReservationId } from "@/lib/utils";

export function useReservationLookup(code: string) {
  return useQuery({
    queryKey: ['reservation-lookup', code],
    queryFn: async () => {
      // Obtener todas las reservas
      const { data: reservations, error } = await supabase
        .from('reservations')
        .select(`
          *,
          unit_id,
          payment_details,
          selected_activities,
          selected_packages
        `);

      if (error) throw error;

      // Buscar la reserva que coincida con el código formateado
      const reservation = reservations?.find(r => {
        const formattedId = formatReservationId(r.id);
        return formattedId === code;
      });

      if (!reservation) {
        throw new Error('No se encontró la reserva');
      }

      return reservation;
    },
    retry: false
  });
}
