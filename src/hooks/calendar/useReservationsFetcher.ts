
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

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
      // Fetching reservations from database
      
      // Extend the date range a bit to capture reservations that might overlap with the month
      const extendedStart = new Date(start);
      extendedStart.setDate(extendedStart.getDate() - 7);
      
      const extendedEnd = new Date(end);
      extendedEnd.setDate(extendedEnd.getDate() + 7);
      
      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from('reservations')
        .select('count', { count: 'exact', head: true });
      
      if (testError) {
        console.error('❌ [useReservationsFetcher] Error de conexión con Supabase:', testError);
        throw new Error(`Error de conexión: ${testError.message}`);
      }
      
      // Connection successful
      
      const { data, error: supabaseError } = await supabase
        .from('reservations')
        .select('*')
        .eq('status', 'confirmed') // Solo obtener reservas confirmadas
        .or(`check_in.lte.${extendedEnd.toISOString()},check_out.gte.${extendedStart.toISOString()}`);
      
      if (supabaseError) {
        console.error("❌ [useReservationsFetcher] Error obteniendo reservas:", supabaseError);
        throw new Error(`Error obteniendo reservas: ${supabaseError.message}`);
      }
      
      // Successfully fetched reservations
      
      setReservations(data || []);
      return data; // Retornar los datos obtenidos
    } catch (error: any) {
      console.error("❌ [useReservationsFetcher] Error general:", error);
      setError(error.message || "Error desconocido al obtener reservaciones");
      setReservations([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth]);

  // useEffect para llamar a fetchReservations cuando cambie currentMonth
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Exponer una función refetch que llama a fetchReservations
  const refetch = useCallback(() => {
    fetchReservations();
  }, [fetchReservations]);

  return { 
    reservations, 
    isLoading,
    error,
    refetch
  };
};
