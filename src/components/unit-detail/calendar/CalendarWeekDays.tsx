
import { format, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";

export const CalendarWeekDays = () => {
  // Get week day headers
  const weekDays = eachDayOfInterval({
    start: new Date(2021, 0, 4), // First Monday of 2021
    end: new Date(2021, 0, 10) // Following Sunday
  }).map(day => format(day, "EEEEEE", { locale: es }));

  return (
    <div className="grid grid-cols-7 gap-1 mb-2">
      {weekDays.map((day, i) => (
        <div key={i} className="text-center text-sm font-medium">
          {day}
        </div>
      ))}
    </div>
  );
};
