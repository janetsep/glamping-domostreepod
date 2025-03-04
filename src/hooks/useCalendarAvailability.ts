
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay
} from "date-fns";
import { AvailabilityCalendarDay } from "@/types";

export const useCalendarAvailability = (unitId: string, currentMonth: Date, selectedDate: Date | null) => {
  const [calendarDays, setCalendarDays] = useState<AvailabilityCalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCalendarData = async () => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      const availabilityData = await fetchAvailability(start, end);
      setCalendarDays(availabilityData);
    };
    
    loadCalendarData();
  }, [currentMonth, unitId, selectedDate]);

  const fetchAvailability = async (start: Date, end: Date) => {
    try {
      setIsLoading(true);
      
      // Get all days in the interval
      const daysInMonth = eachDayOfInterval({ start, end });
      
      // Get reservations for this unit in this date range
      // Usamos exactamente la misma lógica que en useAvailability.ts
      const { data: reservations, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("unit_id", unitId)
        .eq("status", "confirmed")
        .or(`check_in.lte.${end.toISOString()},check_out.gte.${start.toISOString()}`);
      
      if (error) {
        console.error("Error fetching reservations:", error);
        return [];
      }
      
      console.log("Calendario: Reservaciones encontradas:", reservations?.length || 0);
      if (reservations && reservations.length > 0) {
        console.log("Calendario: Detalles de reservaciones:", JSON.stringify(reservations));
      }
      
      // Mark days as unavailable if they fall within any reservation period
      const availabilityMap = daysInMonth.map(day => {
        let isAvailable = true;
        
        // Check if the day falls within any reservation period
        if (reservations && reservations.length > 0) {
          for (const reservation of reservations) {
            const checkIn = new Date(reservation.check_in);
            const checkOut = new Date(reservation.check_out);
            
            if (day >= checkIn && day <= checkOut) {
              isAvailable = false;
              break;
            }
          }
        }
        
        return {
          date: day,
          isAvailable,
          isSelected: selectedDate ? isSameDay(day, selectedDate) : false
        };
      });
      
      return availabilityMap;
    } catch (error) {
      console.error("Error in fetchAvailability:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { calendarDays, isLoading };
};
