
import { format, isSameMonth } from "date-fns";
import { AvailabilityCalendarDay } from "@/types";

interface CalendarGridProps {
  calendarDays: AvailabilityCalendarDay[];
  currentMonth: Date;
  onDateClick: (day: AvailabilityCalendarDay) => void;
}

export const CalendarGrid = ({ calendarDays, currentMonth, onDateClick }: CalendarGridProps) => {
  // Función para obtener la clase CSS para cada celda del día
  const getDayClass = (day: AvailabilityCalendarDay) => {
    let classes = "rounded-full w-8 h-8 flex items-center justify-center";
    
    if (!isSameMonth(day.date, currentMonth)) {
      classes += " text-gray-400";
    }
    
    if (day.isSelected) {
      classes += " bg-primary text-white";
    } else if (day.isAvailable) {
      // Si hay pocos domos disponibles (menos de la mitad), usamos un color amarillo
      if (day.availableUnits && day.availableUnits <= (day.totalUnits / 2)) {
        classes += " bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer";
      } else {
        classes += " bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer";
      }
    } else {
      classes += " bg-red-100 text-red-800 cursor-not-allowed";
    }
    
    return classes;
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {calendarDays.map((day, i) => (
        <div
          key={i}
          onClick={() => onDateClick(day)}
          className="p-1 text-center"
        >
          <div className={getDayClass(day)}>
            {format(day.date, "d")}
          </div>
          {day.availableUnits !== undefined && day.isAvailable && isSameMonth(day.date, currentMonth) && (
            <div className="text-[10px] text-gray-600 mt-1">
              {day.availableUnits}/{day.totalUnits}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
