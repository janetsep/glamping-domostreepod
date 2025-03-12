
import { format, addDays, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarWeekDaysProps {
  isCompact?: boolean;
}

export const CalendarWeekDays = ({ isCompact = false }: CalendarWeekDaysProps) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start on Monday
  const weekDays = [];
  
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    weekDays.push(format(day, "EEEEEE", { locale: es }).toUpperCase());
  }
  
  return (
    <div className={`grid grid-cols-7 gap-2 ${isCompact ? 'mb-1' : 'mb-2'}`}>
      {weekDays.map((day, index) => (
        <div 
          key={index} 
          className={`text-center font-medium text-gray-600 ${isCompact ? 'text-xs' : 'text-base'}`}
        >
          {day}
        </div>
      ))}
    </div>
  );
};
