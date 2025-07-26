
import React, { useEffect } from 'react';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { AvailabilityCalendarDay } from '@/types';

interface CalendarGridProps {
  calendarDays: AvailabilityCalendarDay[];
  currentMonth: Date;
  onDateClick: (day: AvailabilityCalendarDay) => void;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  disableNightMode?: boolean;
  requiredDomos?: number;
  hoverDate?: Date;
  onHoverDate?: (date: Date | undefined) => void;
}

export const CalendarGrid = ({
  calendarDays,
  currentMonth,
  onDateClick,
  selectedStartDate,
  selectedEndDate,
  disableNightMode,
  requiredDomos = 1,
  hoverDate,
  onHoverDate
}: CalendarGridProps) => {

  // Función para obtener clases CSS según disponibilidad
  const getDateClasses = (day: AvailabilityCalendarDay): string => {
    let classes = "h-10 w-full rounded-full flex flex-col items-center justify-center relative cursor-pointer transition-all duration-200";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPastDate = day.date < today;
    
    // Verificar si el día está seleccionado
    const isStartDate = selectedStartDate && isSameDay(day.date, selectedStartDate);
    const isEndDate = selectedEndDate && isSameDay(day.date, selectedEndDate);
    const isSelected = isStartDate || isEndDate;
    
    // Verificar si está en el rango seleccionado
    const isInRange = selectedStartDate && selectedEndDate && 
        day.date > selectedStartDate && day.date < selectedEndDate;
    
    // Verificar si está en el rango de hover (preview)
    const isInHoverRange = selectedStartDate && !selectedEndDate && hoverDate && 
        ((day.date > selectedStartDate && day.date <= hoverDate) || 
         (day.date >= hoverDate && day.date < selectedStartDate));

    // Si está seleccionado, usar colores de selección
    if (isSelected) {
      classes += " text-white bg-blue-500 hover:bg-blue-600 font-semibold";
    } 
    // Si está en el rango seleccionado, usar colores de rango
    else if (isInRange) {
      classes += " bg-blue-100 text-blue-700 hover:bg-blue-200";
    }
    // Si está en el rango de hover (preview), usar colores de preview
    else if (isInHoverRange) {
      classes += " bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200";
    }
    else {
      // Aplicar clases de texto según el mes
      if (!isSameMonth(day.date, currentMonth)) {
        classes += " text-gray-300";
      } else {
        classes += " text-gray-900";
      }

      // Aplicar clases de disponibilidad
      if (isPastDate) {
        classes += " bg-gray-50 text-gray-300 cursor-not-allowed";
      } else if (!day.isAvailable || day.availableUnits === 0) {
        classes += " bg-red-100 text-red-600 cursor-not-allowed";
      } else if (day.availableUnits !== undefined && day.availableUnits > 0) {
        // Si hay al menos 1 domo disponible, mostrar como disponible
        if (day.availableUnits >= 3) {
          classes += " bg-green-100 text-green-700 hover:bg-green-200"; // Buena disponibilidad
        } else if (day.availableUnits >= 2) {
          classes += " bg-yellow-100 text-yellow-700 hover:bg-yellow-200"; // Disponibilidad moderada
        } else {
          classes += " bg-orange-100 text-orange-700 hover:bg-orange-200"; // Disponibilidad limitada
        }
      } else {
        classes += " hover:bg-gray-100";
      }
    }
    
    // Clases para días en el rango seleccionado (si selectedEndDate existe)
    if (selectedStartDate && selectedEndDate && 
        day.date > selectedStartDate && day.date < selectedEndDate && !isSelected) {
      classes += " bg-blue-100 text-blue-700 hover:bg-blue-200";
    }
    
    // Resaltar el día de hoy
    if (isSameDay(day.date, today) && !isSelected) {
      classes += " ring-2 ring-blue-400";
    }
    
    return classes;
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {calendarDays.map((day, index) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isPastDate = day.date < today;
        const canClick = day.isAvailable && !isPastDate && (day.availableUnits || 0) > 0;

        const handleClick = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (canClick) {
            onDateClick(day);
          }
        };
        
        const handleMouseEnter = () => {
          if (canClick && onHoverDate && selectedStartDate && !selectedEndDate) {
            onHoverDate(day.date);
          }
        };
        
        const handleMouseLeave = () => {
          if (onHoverDate && selectedStartDate && !selectedEndDate) {
            onHoverDate(undefined);
          }
        };

        return (
          <div 
            key={index} 
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative ${canClick ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            <div className={getDateClasses(day)}>
              <span className="text-sm font-medium">{format(day.date, 'd')}</span>
              
              {/* Mostrar disponibilidad solo para fechas del mes actual y futuras */}
              {isSameMonth(day.date, currentMonth) && !isPastDate && (
                <span className="text-xs mt-0.5 opacity-75">
                  {day.availableUnits !== undefined && day.totalUnits !== undefined && (
                    `${day.availableUnits}/${day.totalUnits}`
                  )}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
