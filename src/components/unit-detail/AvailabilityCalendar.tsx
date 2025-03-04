
import { useState } from "react";
import { addMonths, subMonths } from "date-fns";
import { useCalendarAvailability } from "@/hooks/useCalendarAvailability";
import { AvailabilityCalendarDay } from "@/types";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { CalendarWeekDays } from "./calendar/CalendarWeekDays";
import { CalendarGrid } from "./calendar/CalendarGrid";
import { CalendarLegend } from "./calendar/CalendarLegend";
import { CalendarLoading } from "./calendar/CalendarLoading";

interface AvailabilityCalendarProps {
  unitId: string;
  onSelectDate?: (date: Date) => void;
}

export const AvailabilityCalendar = ({ unitId, onSelectDate }: AvailabilityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const { calendarDays, isLoading } = useCalendarAvailability(unitId, currentMonth, selectedDate);

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
