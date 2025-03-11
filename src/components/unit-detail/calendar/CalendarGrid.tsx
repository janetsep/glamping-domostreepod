
import { format, isSameMonth, isSameDay, isToday, isBefore } from "date-fns";
import { AvailabilityCalendarDay } from "@/types";

interface CalendarGridProps {
  calendarDays: AvailabilityCalendarDay[];
  currentMonth: Date;
  onDateClick: (day: AvailabilityCalendarDay) => void;
  selectedStartDate?: Date | null;
  selectedEndDate?: Date | null;
}

export const CalendarGrid = ({ 
  calendarDays, 
  currentMonth, 
  onDateClick,
  selectedStartDate,
  selectedEndDate
}: CalendarGridProps) => {
  // Function to check if a date is selectable
  const isDateSelectable = (day: AvailabilityCalendarDay): boolean => {
    const now = new Date();
    
    // If it's a past date, it's not selectable
    if (isBefore(day.date, now) && !isToday(day.date)) {
      return false;
    }
    
    // If it's today but after 14:00, it's not selectable
    if (isToday(day.date)) {
      const currentHour = now.getHours();
      if (currentHour >= 14) {
        return false;
      }
    }
    
    // Check availability
    return day.isAvailable;
  };

  // Function to get the CSS class for each day cell
  const getDayClass = (day: AvailabilityCalendarDay) => {
    let classes = "rounded-full w-8 h-8 flex items-center justify-center";
    
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

  // Function to get the availability percentage
  const getAvailabilityPercentage = (day: AvailabilityCalendarDay): string => {
    if (day.availableUnits === undefined || day.totalUnits === undefined) {
      return "";
    }
    
    const percentage = Math.round((day.availableUnits / day.totalUnits) * 100);
    return `${percentage}%`;
  };

  const handleDateClick = (day: AvailabilityCalendarDay, e: React.MouseEvent) => {
    console.log("CalendarGrid: clicked on date", day.date);
    // Prevent default behavior to avoid event bubbling issues
    e.preventDefault();
    e.stopPropagation();
    
    if (isDateSelectable(day)) {
      onDateClick(day);
    }
  };

  return (
    <div className="grid grid-cols-7 gap-1 pointer-events-auto">
      {calendarDays.map((day, i) => (
        <div
          key={i}
          className="p-1 text-center pointer-events-auto"
        >
          <div 
            className={getDayClass(day)}
            onClick={(e) => handleDateClick(day, e)}
          >
            {format(day.date, "d")}
          </div>
          {day.availableUnits !== undefined && isSameMonth(day.date, currentMonth) && (
            <div className="text-[10px] text-gray-600 mt-1">
              {getAvailabilityPercentage(day)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
