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
    let classes = "h-10 w-full rounded-full flex flex-col items-center justify-center relative cursor-pointer";
    
    // Solo loggear cambios en disponibilidad para el día actual
    if (isSameMonth(day.date, currentMonth) && day.date.getDate() === new Date().getDate()) {
      console.log('📅 [CalendarGrid] Disponibilidad hoy:', {
        fecha: day.date.toISOString().split('T')[0],
        disponible: day.isAvailable,
        unidadesDisponibles: day.availableUnits,
        unidadesRequeridas: requiredDomos
      });
    }

    // Usar la propiedad isSelected del día para determinar las clases
    if (day.isSelected) {
      classes += " text-white bg-blue-500 hover:bg-blue-600";
    } else {
      // Si no está seleccionado, aplicar clases de texto según el mes
      if (!isSameMonth(day.date, currentMonth)) {
        classes += " text-gray-400";
      } else {
        classes += " text-gray-900";
      }

      // Aplicar clases de disponibilidad si no está seleccionado
      if (!day.isAvailable) {
        classes += " bg-red-100 hover:bg-red-200";
      } else if (day.availableUnits !== undefined && requiredDomos !== undefined) {
        if (day.availableUnits < requiredDomos) {
          classes += " bg-yellow-100 hover:bg-yellow-200"; // Disponibilidad parcial
        } else {
          classes += " bg-green-100 hover:bg-green-200"; // Completamente disponible
        }
      }
      // Aplicar clase de hover si no está seleccionado
      classes += " hover:bg-gray-100";
    }
    
    // Clases para días en el rango seleccionado (si selectedEndDate existe)
    if (selectedStartDate && selectedEndDate && 
        day.date > selectedStartDate && day.date < selectedEndDate) {
      // Si ya está seleccionado (inicio/fin), no aplicar clase de rango adicional
      if (!day.isSelected) {
        classes += " bg-blue-100 hover:bg-blue-200";
      }
    }
    
    return classes;
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {calendarDays.map((day, index) => {
        const handleClick = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (day.isAvailable) {
            console.log('📅 [CalendarGrid] Click en fecha disponible:', {
              fecha: day.date.toISOString().split('T')[0],
              unidadesDisponibles: day.availableUnits
            });
            onDateClick(day);
          }
        };

        return (
          <div 
            key={index} 
            onClick={handleClick}
            className={`relative ${day.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
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
        );
      })}
    </div>
  );
};
