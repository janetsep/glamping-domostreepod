
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle, Bookmark, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AvailabilityCalendarDay } from "@/types";

interface AvailabilityCalendarProps {
  unitId: string;
  onSelectDate?: (date: Date) => void;
}

export const AvailabilityCalendar = ({ unitId, onSelectDate }: AvailabilityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<AvailabilityCalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  useEffect(() => {
    const loadCalendarData = async () => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      const availabilityData = await fetchAvailability(start, end);
      setCalendarDays(availabilityData);
    };
    
    loadCalendarData();
  }, [currentMonth, unitId, selectedDate]);

  const handleDateClick = (day: AvailabilityCalendarDay) => {
    if (!day.isAvailable) return;
    
    setSelectedDate(day.date);
    if (onSelectDate) {
      onSelectDate(day.date);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  // Create a grid of days for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = monthStart;
  const endDate = monthEnd;

  const dateFormat = "MMMM yyyy";
  const dayFormat = "EEEEEE";
  
  // Get week day headers
  const weekDays = eachDayOfInterval({
    start: new Date(2021, 0, 4), // First Monday of 2021
    end: new Date(2021, 0, 10) // Following Sunday
  }).map(day => format(day, dayFormat, { locale: es }));

  const firstDayOfMonth = monthStart.getDay();
  
  // Calculate total days to display (previous month, current month, next month)
  const totalDays = calendarDays.length;
  const rows = Math.ceil(totalDays / 7);

  // Function to get class name for day cell
  const getDayClass = (day: AvailabilityCalendarDay) => {
    let classes = "rounded-full w-8 h-8 flex items-center justify-center";
    
    if (!isSameMonth(day.date, currentMonth)) {
      classes += " text-gray-400";
    }
    
    if (day.isSelected) {
      classes += " bg-primary text-white";
    } else if (day.isAvailable) {
      classes += " bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer";
    } else {
      classes += " bg-red-100 text-red-800 cursor-not-allowed";
    }
    
    return classes;
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousMonth}
          disabled={isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-medium capitalize">
          {format(currentMonth, dateFormat, { locale: es })}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextMonth}
          disabled={isLoading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando disponibilidad...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day, i) => (
              <div key={i} className="text-center text-sm font-medium">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => (
              <div
                key={i}
                onClick={() => handleDateClick(day)}
                className="p-1 text-center"
              >
                <div className={getDayClass(day)}>
                  {format(day.date, "d")}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center items-center mt-4 space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-100 mr-2"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-100 mr-2"></div>
              <span>No disponible</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span>Seleccionado</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
