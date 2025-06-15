
import { useState, useEffect } from "react";
import { addMonths, subMonths, isToday, isBefore, isSameDay, isSameMonth } from "date-fns";
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
  onSelectRange: (range: { startDate: Date | undefined, endDate: Date | undefined }) => void;
  checkDateRange?: boolean;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  initialMonth?: Date;
  disableNightMode?: boolean;
  requiredDomos?: number;
}

export const AvailabilityCalendar = ({ 
  unitId, 
  onSelectRange, 
  checkDateRange = false,
  selectedStartDate,
  selectedEndDate,
  initialMonth,
  disableNightMode = false,
  requiredDomos = 1
}: AvailabilityCalendarProps) => {
  // Usar initialMonth si se proporciona, de lo contrario usar la fecha actual
  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth || new Date());
  const [range, setRange] = useState<{ from?: Date, to?: Date }>({
    from: selectedStartDate,
    to: selectedEndDate,
  });
  
  // Actualizar el mes actual si initialMonth cambia
  useEffect(() => {
    if (initialMonth) {
      setCurrentMonth(initialMonth);
    }
  }, [initialMonth]);

  // Actualizar el estado local cuando cambien las props
  useEffect(() => {
    console.log('🔍 [AvailabilityCalendar] Props actualizadas:', { 
      selectedStartDate: selectedStartDate?.toISOString(), 
      selectedEndDate: selectedEndDate?.toISOString() 
    });

    // Solo actualizar el estado local si las props son diferentes
    if (
      (selectedStartDate?.getTime() !== range.from?.getTime()) ||
      (selectedEndDate?.getTime() !== range.to?.getTime())
    ) {
      console.log('🔍 [AvailabilityCalendar] Actualizando estado local del rango');
      setRange({
        from: selectedStartDate,
        to: selectedEndDate
      });
    }
  }, [selectedStartDate, selectedEndDate]);

  // Efecto para depurar cambios en el estado local
  useEffect(() => {
    console.log('🔍 [AvailabilityCalendar] Estado del rango actualizado:', {
      from: range.from?.toISOString(),
      to: range.to?.toISOString()
    });
  }, [range]);

  const { calendarDays, isLoading, isDateAvailable, isDateRangeAvailable } = useCalendarAvailability(unitId, currentMonth, range.from);

  const handleDateClick = async (day: AvailabilityCalendarDay) => {
    console.log('🔍 [AvailabilityCalendar] handleDateClick llamado con:', {
      date: day.date.toISOString(),
      isAvailable: day.isAvailable,
      availableUnits: day.availableUnits,
      requiredDomos,
      isToday: isToday(day.date),
      isBeforeToday: isBefore(day.date, new Date())
    });

    // Solo validar que la fecha esté disponible (al menos 1 domo) y no sea pasada
    if (!day.isAvailable || (day.availableUnits !== undefined && day.availableUnits === 0)) {
      toast({
        title: "Fecha no disponible",
        description: "Esta fecha no tiene domos disponibles para reserva.",
        variant: "destructive"
      });
      return;
    }

    // Validar que no sea una fecha pasada
    if (isBefore(day.date, new Date()) && !isToday(day.date)) {
      toast({
        title: "Fecha no válida",
        description: "No puedes seleccionar una fecha pasada.",
        variant: "destructive"
      });
      return;
    }

    let newRange: { from?: Date, to?: Date };

    // Si estamos seleccionando la fecha de inicio
    if (!range.from || (range.from && range.to)) {
      newRange = { from: day.date, to: undefined };
      console.log('🔍 [AvailabilityCalendar] Iniciando nuevo rango con fecha:', day.date.toISOString());
    } 
    // Si la fecha seleccionada es anterior a la fecha de inicio
    else if (day.date < range.from) {
      newRange = { from: day.date, to: undefined };
      console.log('🔍 [AvailabilityCalendar] Reiniciando rango con nueva fecha de inicio:', day.date.toISOString());
    } 
    // Si estamos seleccionando la fecha de fin
    else {
      // Verificar disponibilidad del rango si es necesario
      if (checkDateRange) {
        const { isAvailable, availableUnits } = await isDateRangeAvailable(range.from, day.date, requiredDomos);
        if (!isAvailable) {
          toast({
            title: "Rango no disponible",
            description: availableUnits !== undefined
              ? `Se necesitan ${requiredDomos} domos, pero solo hay ${availableUnits} disponibles en algún día del rango.`
              : "No hay disponibilidad para el rango de fechas seleccionado.",
            variant: "destructive"
          });
          return;
        }
      }
      
      newRange = { from: range.from, to: day.date };
      console.log('🔍 [AvailabilityCalendar] Completando rango con fecha de fin:', day.date.toISOString());
    }

    // Actualizar estado local
    setRange(newRange);

    // Notificar al componente padre
    console.log('🔍 [AvailabilityCalendar] Notificando cambio de rango:', {
      startDate: newRange.from?.toISOString(),
      endDate: newRange.to?.toISOString()
    });
    onSelectRange({ 
      startDate: newRange.from, 
      endDate: newRange.to 
    });

    // Asegurarse de que el calendario muestre el mes de la fecha seleccionada
    if (!isSameMonth(day.date, currentMonth)) {
      setCurrentMonth(day.date);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  if (isLoading) {
    return <CalendarLoading />;
  }

  return (
    <div className="calendar-container">
      <CalendarHeader
        currentMonth={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />
      <CalendarWeekDays />
      <CalendarGrid
        calendarDays={calendarDays}
        currentMonth={currentMonth}
        onDateClick={handleDateClick}
        selectedStartDate={range.from}
        selectedEndDate={range.to}
        disableNightMode={disableNightMode}
        requiredDomos={requiredDomos}
      />
      <CalendarLegend />
    </div>
  );
};
