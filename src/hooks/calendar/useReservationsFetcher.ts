
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";

/**
 * Hook to fetch reservations for a given date range
 */
export const useReservationsFetcher = (currentMonth: Date) => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      
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
        
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('status', 'confirmed')
          .or(`check_in.lte.${extendedEnd.toISOString()},check_out.gte.${extendedStart.toISOString()}`);
        
        if (error) {
          console.error("Error fetching reservations:", error);
          return [];
        }
        
        console.log(`Found ${data?.length || 0} reservations for the selected month`);
        setReservations(data || []);
        return data;
      } catch (error) {
        console.error("Error in fetchReservations:", error);
        return [];
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReservations();
  }, [currentMonth]);

  return { 
    reservations, 
    isLoading 
  };
};
