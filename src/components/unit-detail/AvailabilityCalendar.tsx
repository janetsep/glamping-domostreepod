
import { useState } from "react";
import { addMonths, subMonths } from "date-fns";
import { useCalendarAvailability } from "@/hooks/useCalendarAvailability";
import { AvailabilityCalendarDay } from "@/types";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { CalendarWeekDays } from "./calendar/CalendarWeekDays";
import { CalendarGrid } from "./calendar/CalendarGrid";
import { CalendarLegend } from "./calendar/CalendarLegend";
import { CalendarLoading } from "./calendar/CalendarLoading";
import { toast } from "@/components/ui/use-toast";

interface AvailabilityCalendarProps {
  unitId: string;
  onSelectDate?: (date: Date) => void;
  checkDateRange?: boolean;
}

export const AvailabilityCalendar = ({ unitId, onSelectDate, checkDateRange = false }: AvailabilityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const { calendarDays, isLoading, isDateAvailable } = useCalendarAvailability(unitId, currentMonth, selectedDate);

  const handleDateClick = async (day: AvailabilityCalendarDay) => {
    if (!day.isAvailable) {
      toast({
        variant: "destructive",
        title: "Fecha no disponible",
        description: "Esta fecha no está disponible para reserva."
      });
      return;
    }
    
    // Check if date is truly available (double-check)
    const isAvailable = await isDateAvailable(day.date);
    if (!isAvailable) {
      toast({
        variant: "destructive",
        title: "Fecha no disponible",
        description: "Esta fecha acaba de ser reservada por otro usuario."
      });
      return;
    }
    
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

  return (
    <div className="mt-4">
      <CalendarHeader 
        currentMonth={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        isLoading={isLoading}
      />
      
      {isLoading ? (
        <CalendarLoading />
      ) : (
        <>
          <CalendarWeekDays />
          
          <CalendarGrid 
            calendarDays={calendarDays}
            currentMonth={currentMonth}
            onDateClick={handleDateClick}
          />
          
          <CalendarLegend />
        </>
      )}
    </div>
  );
};
