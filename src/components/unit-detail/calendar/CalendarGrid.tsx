import React from 'react';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { AvailabilityCalendarDay } from '@/types';

interface CalendarGridProps {
  days: AvailabilityCalendarDay[];
  currentMonth: Date;
  onDateClick: (day: AvailabilityCalendarDay) => void;
  selectedDate: Date | null;
  requiredDomos?: number;
}

export const CalendarGrid = ({
  days,
  currentMonth,
  onDateClick,
  selectedDate,
  requiredDomos = 1
}: CalendarGridProps) => {
  // Función para obtener clases CSS según disponibilidad
  const getDateClasses = (day: AvailabilityCalendarDay): string => {
    let classes = "h-10 w-full rounded-full flex flex-col items-center justify-center relative cursor-pointer hover:bg-gray-100";
    
    // Si no es del mes actual, atenuar
    if (!isSameMonth(day.date, currentMonth)) {
      classes += " text-gray-400";
    } else {
      classes += " text-gray-900";
    }
    
    // Si está seleccionado
    if (selectedDate && isSameDay(day.date, selectedDate)) {
      classes += " bg-blue-100";
    }
    
    // Clases según disponibilidad
    if (!day.isAvailable) {
      classes += " bg-red-100 hover:bg-red-200";
    } else if (day.availableUnits !== undefined && requiredDomos !== undefined) {
      if (day.availableUnits < requiredDomos) {
        classes += " bg-yellow-100 hover:bg-yellow-200"; // Disponibilidad parcial
      } else {
        classes += " bg-green-100 hover:bg-green-200"; // Completamente disponible
      }
    }
    
    return classes;
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => (
        <div key={index} onClick={() => onDateClick(day)}>
          <div className={getDateClasses(day)}>
            <span>{format(day.date, 'd')}</span>
            
            {/* Mostrar disponibilidad */}
            <span className="text-xs mt-0.5">
              {day.availableUnits !== undefined && day.totalUnits !== undefined && (
                `${day.availableUnits}/${day.totalUnits}`
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};