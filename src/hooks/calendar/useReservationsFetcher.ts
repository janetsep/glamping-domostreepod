import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";

/**
 * Hook to fetch reservations for a given date range
 */
export const useReservationsFetcher = (currentMonth: Date) => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener las reservas, envuelta en useCallback
  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const start = new Date(currentMonth);
    start.setDate(1); // First day of month
    
    const end = new Date(currentMonth);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0); // Last day of month
    
    try {
      console.log(`Fetching reservations from ${format(start, 'yyyy-MM-dd')} to ${format(end, 'yyyy-MM-dd')}`);
      
      // Extend the date range a bit to capture reservations that might overlap with the month
      const extendedStart = new Date(start);
      extendedStart.setDate(extendedStart.getDate() - 7);
      
      const extendedEnd = new Date(end);
      extendedEnd.setDate(extendedEnd.getDate() + 7);
      
      const { data, error: supabaseError } = await supabase
        .from('reservations')
        .select('*')
        .eq('status', 'confirmed') // Solo obtener reservas confirmadas
        .or(`check_in.lte.${extendedEnd.toISOString()},check_out.gte.${extendedStart.toISOString()}`);
      
      if (supabaseError) {
        console.error("Error fetching reservations:", supabaseError);
        setError(supabaseError.message);
        return [];
      }
      
      console.log(`Found ${data?.length || 0} confirmed reservations for the selected month`);
      console.log('Reservations data:', data);
      
      // Verifica y registra las reservas sin unit_id para depuración
      const reservationsWithoutUnitId = (data || []).filter(r => !r.unit_id);
      if (reservationsWithoutUnitId.length > 0) {
        console.log(`Warning: Found ${reservationsWithoutUnitId.length} reservations without unit_id`);
      }
      
      setReservations(data || []);
      return data; // Retornar los datos obtenidos
    } catch (error: any) {
      console.error("Error in fetchReservations:", error);
      setError(error.message || "Error desconocido al obtener reservaciones");
      // Return empty array or handle error as appropriate
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth, setIsLoading, setError, setReservations]); // Dependencias del useCallback

  // useEffect para llamar a fetchReservations cuando cambie currentMonth
  useEffect(() => {
    fetchReservations();
  }, [currentMonth]);

  // Exponer una función refetch que llama a fetchReservations
  const refetch = useCallback(() => {
    fetchReservations();
  }, [fetchReservations]); // Dependencia de refetch es fetchReservations

  return { 
    reservations, 
    isLoading,
    error,
    refetch // Exponer la función refetch
  };
};