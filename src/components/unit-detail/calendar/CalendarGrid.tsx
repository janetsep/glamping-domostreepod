
import { format, isSameMonth, isSameDay, isToday, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { AvailabilityCalendarDay } from "@/types";

interface CalendarGridProps {
  calendarDays: AvailabilityCalendarDay[];
  currentMonth: Date;
  onDateClick: (day: AvailabilityCalendarDay) => void;
  selectedStartDate?: Date | null;
  selectedEndDate?: Date | null;
  disableNightMode?: boolean;
  requiredDomos?: number;
}

export const CalendarGrid = ({ 
  calendarDays, 
  currentMonth, 
  onDateClick,
  selectedStartDate,
  selectedEndDate,
  disableNightMode = false,
  requiredDomos = 1
}: CalendarGridProps) => {
  // Función para verificar si una fecha es seleccionable
  const isDateSelectable = (day: AvailabilityCalendarDay): boolean => {
    const now = new Date();
    
    // Si es fecha pasada, no es seleccionable
    if (isBefore(day.date, now) && !isToday(day.date)) {
      return false;
    }
    
    // Si es hoy pero después de las 14:00, no es seleccionable - solo si nightMode no está desactivado
    if (!disableNightMode && isToday(day.date)) {
      const currentHour = now.getHours();
      if (currentHour >= 14) {
        return false;
      }
    }
    
    // Verificamos si hay suficientes domos disponibles para la cantidad requerida
    const hasEnoughDomos = day.availableUnits !== undefined && day.availableUnits >= (requiredDomos || 1);
    
    // Solo seleccionable si está disponible Y tiene suficientes domos
    return day.isAvailable && hasEnoughDomos;
  };

  // Función para obtener la clase CSS para cada celda de día
  const getDayClass = (day: AvailabilityCalendarDay) => {
    let classes = "rounded-full w-10 h-10 flex items-center justify-center text-base";
    
    if (!isSameMonth(day.date, currentMonth)) {
      classes += " text-gray-400";
    }
    
    // Verificar si este día es la fecha de inicio seleccionada
    if (selectedStartDate && isSameDay(day.date, selectedStartDate)) {
      classes += " bg-primary text-white";
    } 
    // Verificar si este día es la fecha de fin seleccionada
    else if (selectedEndDate && isSameDay(day.date, selectedEndDate)) {
      classes += " bg-primary text-white";
    } 
    // Verificar si el día está entre la fecha de inicio y fin (rango destacado)
    else if (selectedStartDate && selectedEndDate && 
             day.date > selectedStartDate && 
             day.date < selectedEndDate) {
      classes += " bg-primary/20 text-primary-foreground";
    }
    // Verificar si la fecha no es seleccionable (fecha pasada o después de las 14:00 hoy)
    else if (!isDateSelectable(day)) {
      classes += " bg-gray-100 text-gray-400 cursor-not-allowed";
    }
    // De lo contrario, usar el estilo de disponibilidad
    else if (day.isAvailable) {
      classes += " bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer";
    } else {
      classes += " bg-red-100 text-red-800 cursor-not-allowed";
    }
    
    return classes;
  };

  // Función para obtener el texto de disponibilidad, muestra correctamente la cantidad de domos disponibles
  const getAvailabilityDisplay = (day: AvailabilityCalendarDay): string => {
    if (day.availableUnits === undefined || day.totalUnits === undefined) {
      return "";
    }
    
    // Mostrar la cantidad de domos disponibles de un total
    return `${day.availableUnits}/${day.totalUnits}`;
  };

  // Determina si hay suficientes domos disponibles según los requeridos
  const hasEnoughDomos = (day: AvailabilityCalendarDay): boolean => {
    return day.availableUnits !== undefined && 
           requiredDomos !== undefined && 
           day.availableUnits >= requiredDomos;
  };

  // Función para determinar correctamente el estado de disponibilidad
  const getAvailabilityStatus = (day: AvailabilityCalendarDay): string => {
    if (!day.isAvailable) {
      return "";
    }
    
    // Mostrar "Insuficiente" SOLO si realmente hay menos domos disponibles que los requeridos
    if (day.availableUnits !== undefined && requiredDomos !== undefined) {
      if (day.availableUnits < requiredDomos) {
        return "Insuficiente";
      }
    }
    return "";
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {calendarDays.map((day, i) => (
        <div
          key={i}
          onClick={() => isDateSelectable(day) && onDateClick(day)}
          className="p-1 text-center"
        >
          <div className={getDayClass(day)}>
            {format(day.date, "d")}
          </div>
          {day.availableUnits !== undefined && isSameMonth(day.date, currentMonth) && (
            <>
              <div className="text-xs text-gray-600 mt-1 font-medium">
                {getAvailabilityDisplay(day)}
              </div>
              {getAvailabilityStatus(day) && (
                <div className="text-xs text-amber-600 font-medium -mt-1">
                  {getAvailabilityStatus(day)}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};
