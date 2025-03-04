
import { format, isSameMonth } from "date-fns";
import { AvailabilityCalendarDay } from "@/types";

interface CalendarGridProps {
  calendarDays: AvailabilityCalendarDay[];
  currentMonth: Date;
  onDateClick: (day: AvailabilityCalendarDay) => void;
}

export const CalendarGrid = ({ calendarDays, currentMonth, onDateClick }: CalendarGridProps) => {
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
        </div>
      ))}
    </div>
  );
};
