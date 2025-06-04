
import { useQuery } from '@tanstack/react-query';
import { supabase, type Reservation } from '@/lib/supabase';

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async (): Promise<Reservation[]> => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reservations:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
