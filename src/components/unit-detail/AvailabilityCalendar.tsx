
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
  initialMonth?: Date; // Prop para controlar el mes inicial que se muestra
  disableNightMode?: boolean; // Prop para desactivar el modo nocturno
  requiredDomos?: number; // Prop para verificar si hay suficientes domos disponibles
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
  // Usar initialMonth si se proporciona, de lo contrario usar la fecha actual
  const [currentMonth, setCurrentMonth] = useState(initialMonth || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(selectedStartDate);
  
  // Actualizar el mes actual si initialMonth cambia
  useEffect(() => {
    if (initialMonth) {
      setCurrentMonth(initialMonth);
    }
  }, [initialMonth]);

  const { calendarDays, isLoading, isDateAvailable, isDateRangeAvailable } = useCalendarAvailability(unitId, currentMonth, selectedDate);

  const handleDateClick = async (day: AvailabilityCalendarDay) => {
    // Verificar si la fecha es pasada o si es hoy después de las 14:00
    const now = new Date();
    if (isBefore(day.date, now) && !isToday(day.date)) {
      toast({
        variant: "destructive",
        title: "Fecha no válida",
        description: "No puedes seleccionar fechas pasadas."
      });
      return;
    }
    
    // Verificar si es hoy pero después de las 14:00 - solo si el modo nocturno está habilitado
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
    
    // Verificar si hay suficientes domos disponibles
    if (day.availableUnits !== undefined && day.availableUnits < requiredDomos) {
      toast({
        variant: "destructive",
        title: "Domos insuficientes",
        description: `Se necesitan ${requiredDomos} domos, pero solo hay ${day.availableUnits} disponibles.`
      });
      return;
    }
    
    // Verificar si la fecha está realmente disponible (verificación doble)
    const isAvailable = await isDateAvailable(day.date);
    if (!isAvailable) {
      toast({
        variant: "destructive",
        title: "Fecha no disponible",
        description: "Esta fecha acaba de ser reservada por otro usuario."
      });
      return;
    }
    
    // Si estamos en modo checkDateRange y tenemos una fecha de inicio seleccionada,
    // verificar si todo el rango está disponible
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
