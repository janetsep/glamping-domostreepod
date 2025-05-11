
import { format, isSameMonth, isSameDay, isToday, isBefore } from "date-fns";
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
  // Function to check if a date is selectable
  const isDateSelectable = (day: AvailabilityCalendarDay): boolean => {
    const now = new Date();
    
    // If it's a past date, it's not selectable
    if (isBefore(day.date, now) && !isToday(day.date)) {
      return false;
    }
    
    // If it's today but after 14:00, it's not selectable - only if night mode is not disabled
    if (!disableNightMode && isToday(day.date)) {
      const currentHour = now.getHours();
      if (currentHour >= 14) {
        return false;
      }
    }
    
    // Check if there are enough domos available for the required number
    const hasEnoughDomos = day.availableUnits !== undefined && day.availableUnits >= (requiredDomos || 1);
    
    // Only selectable if available AND has enough domos
    return day.isAvailable && hasEnoughDomos;
  };

  // Function to get the CSS class for each day cell
  const getDayClass = (day: AvailabilityCalendarDay) => {
    let classes = "rounded-full w-10 h-10 flex items-center justify-center text-base";
    
    if (!isSameMonth(day.date, currentMonth)) {
      classes += " text-gray-400";
    }
    
    // Check if this day is the selected start date
    if (selectedStartDate && isSameDay(day.date, selectedStartDate)) {
      classes += " bg-primary text-white";
    } 
    // Check if this day is the selected end date
    else if (selectedEndDate && isSameDay(day.date, selectedEndDate)) {
      classes += " bg-primary text-white";
    } 
    // Check if day is between start and end date (highlighted range)
    else if (selectedStartDate && selectedEndDate && 
             day.date > selectedStartDate && 
             day.date < selectedEndDate) {
      classes += " bg-primary/20 text-primary-foreground";
    }
    // Check if date is not selectable (past date or after 14:00 today)
    else if (!isDateSelectable(day)) {
      classes += " bg-gray-100 text-gray-400 cursor-not-allowed";
    }
    // Otherwise use availability styling
    else if (day.isAvailable) {
      classes += " bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer";
    } else {
      classes += " bg-red-100 text-red-800 cursor-not-allowed";
    }
    
    return classes;
  };

  // Function to get the availability display text
  const getAvailabilityDisplay = (day: AvailabilityCalendarDay): string => {
    if (day.availableUnits === undefined || day.totalUnits === undefined) {
      return "";
    }
    
    // Mostrar la cantidad de domos disponibles de un total
    return `${day.availableUnits}/${day.totalUnits}`;
  };

  // Function to get availability status text
  const getAvailabilityStatus = (day: AvailabilityCalendarDay): string => {
    if (!day.isAvailable) {
      return "";
    }
    
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
