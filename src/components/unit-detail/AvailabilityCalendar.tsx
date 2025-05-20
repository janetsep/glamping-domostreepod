
import { useState, useEffect } from "react";
import { addMonths, subMonths, isToday, isBefore } from "date-fns";
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
  selectedStartDate?: Date | null;
  selectedEndDate?: Date | null;
  initialMonth?: Date; // Add this prop to control the initial month displayed
  disableNightMode?: boolean; // Add this prop to disable night mode
  requiredDomos?: number; // Add this prop to check if there are enough domos available
}

export const AvailabilityCalendar = ({ 
  unitId, 
  onSelectDate, 
  checkDateRange = false,
  selectedStartDate = null,
  selectedEndDate = null,
  initialMonth,
  disableNightMode = false,
  requiredDomos = 1
}: AvailabilityCalendarProps) => {
  // Use initialMonth if provided, otherwise use current date
  const [currentMonth, setCurrentMonth] = useState(initialMonth || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(selectedStartDate);
  
  // Update current month if initialMonth changes
  useEffect(() => {
    if (initialMonth) {
      setCurrentMonth(initialMonth);
    }
  }, [initialMonth]);

  const { calendarDays, isLoading, isDateAvailable, isDateRangeAvailable } = useCalendarAvailability(unitId, currentMonth, selectedDate);

  const handleDateClick = async (day: AvailabilityCalendarDay) => {
    // Check if date is in the past or if it's today after 14:00
    const now = new Date();
    if (isBefore(day.date, now) && !isToday(day.date)) {
      toast({
        variant: "destructive",
        title: "Fecha no válida",
        description: "No puedes seleccionar fechas pasadas."
      });
      return;
    }
    
    // Check if it's today but after 14:00 - only if night mode is enabled
    if (!disableNightMode && isToday(day.date)) {
      const currentHour = now.getHours();
      if (currentHour >= 14) {
        toast({
          variant: "destructive",
          title: "Fecha no válida",
          description: "No se pueden realizar check-in después de las 14:00 del mismo día."
        });
        return;
      }
    }
    
    if (!day.isAvailable) {
      toast({
        variant: "destructive",
        title: "Fecha no disponible",
        description: "Esta fecha no está disponible para reserva."
      });
      return;
    }
    
    // Check if there are enough domos available
    if (day.availableUnits !== undefined && day.availableUnits < requiredDomos) {
      toast({
        variant: "destructive",
        title: "Domos insuficientes",
        description: `Se necesitan ${requiredDomos} domos, pero solo hay ${day.availableUnits} disponibles.`
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
    
    // If we're in checkDateRange mode and we have a selected start date,
    // check if the entire range is available
    if (checkDateRange && selectedStartDate && day.date > selectedStartDate) {
      const rangeAvailable = await isDateRangeAvailable(selectedStartDate, day.date);
      if (!rangeAvailable) {
        toast({
          variant: "destructive",
          title: "Rango no disponible",
          description: "Alguna fecha en el rango seleccionado no está disponible."
        });
        return;
      }
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
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            disableNightMode={disableNightMode}
            requiredDomos={requiredDomos}
          />
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p className="mb-1">* El formato de disponibilidad es: disponibles/total</p>
            <p className="mb-1">* "Insuficiente" significa que no hay suficientes domos disponibles para la cantidad de huéspedes seleccionada</p>
          </div>
          
          <CalendarLegend />
        </>
      )}
    </div>
  );
};
