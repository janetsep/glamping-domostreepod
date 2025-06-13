
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
}

export const CalendarGrid = ({
  calendarDays,
  currentMonth,
  onDateClick,
  selectedStartDate,
  selectedEndDate,
  disableNightMode,
  requiredDomos = 1
}: CalendarGridProps) => {
  // Solo loggear cuando cambian las fechas seleccionadas
  useEffect(() => {
    if (selectedStartDate || selectedEndDate) {
      console.log('📅 [CalendarGrid] Fechas seleccionadas:', {
        inicio: selectedStartDate?.toISOString().split('T')[0],
        fin: selectedEndDate?.toISOString().split('T')[0]
      });
    }
  }, [selectedStartDate, selectedEndDate]);

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

    // Si está seleccionado, usar colores de selección
    if (isSelected) {
      classes += " text-white bg-blue-500 hover:bg-blue-600 font-semibold";
    } else {
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
            console.log('📅 [CalendarGrid] Click en fecha disponible:', {
              fecha: day.date.toISOString().split('T')[0],
              unidadesDisponibles: day.availableUnits
            });
            onDateClick(day);
          } else {
            console.log('📅 [CalendarGrid] Click en fecha no disponible:', {
              fecha: day.date.toISOString().split('T')[0],
              disponible: day.isAvailable,
              esPasado: isPastDate,
              unidadesDisponibles: day.availableUnits
            });
          }
        };

        return (
          <div 
            key={index} 
            onClick={handleClick}
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
