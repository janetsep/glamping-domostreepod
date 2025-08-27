import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AvailabilityCalendar } from "../AvailabilityCalendar";
interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  unitId: string;
  requiredDomos?: number;
}
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  unitId,
  requiredDomos = 1
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: startDate,
    to: endDate
  });
  const [hoverDate, setHoverDate] = useState<Date | undefined>();
  const handleRangeSelect = (range: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => {
    console.log(' [DateRangePicker] Rango seleccionado:', {
      startDate: range.startDate?.toISOString(),
      endDate: range.endDate?.toISOString()
    });

    // Si se proporciona un rango completo (selección por arrastre)
    if (range.startDate && range.endDate) {
      onStartDateChange(range.startDate);
      onEndDateChange(range.endDate);
      setIsOpen(false); // Cerrar inmediatamente
      return;
    }

    // Si no hay fecha de inicio, establecer la fecha seleccionada como inicio
    if (range.startDate && !startDate) {
      onStartDateChange(range.startDate);
      return;
    }

    // Si ya hay fecha de inicio y se selecciona otra fecha
    if (range.startDate && startDate) {
      // Si la nueva fecha es posterior a la fecha de inicio, usarla como fecha de fin
      if (range.startDate > startDate) {
        onEndDateChange(range.startDate);
        setIsOpen(false); // Cerrar cuando se complete
      }
      // Si la nueva fecha es anterior, reemplazar la fecha de inicio
      else {
        onStartDateChange(range.startDate);
        onEndDateChange(undefined);
      }
    }

    // Si se proporciona directamente una fecha de fin
    if (range.endDate && startDate) {
      onEndDateChange(range.endDate);
      setIsOpen(false);
    }
  };
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Limpiar selección anterior al abrir
      setRange({
        from: undefined,
        to: undefined
      });
      onStartDateChange(undefined);
      onEndDateChange(undefined);
      setHoverDate(undefined);
    }
  };
  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${format(startDate, "dd MMM", {
        locale: es
      })} - ${format(endDate, "dd MMM yyyy", {
        locale: es
      })}`;
    } else if (startDate) {
      return `${format(startDate, "dd MMM yyyy", {
        locale: es
      })} - Seleccionar salida`;
    } else {
      return "Seleccionar fechas";
    }
  };
  const clearDates = () => {
    onStartDateChange(undefined);
    onEndDateChange(undefined);
  };
  return <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Fechas de estadía
      </label>
      
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="flex-1">{formatDateRange()}</span>
            {(startDate || endDate) && <button onClick={e => {
            e.stopPropagation();
            clearDates();
          }} className="ml-2 text-gray-400 hover:text-gray-600">
                ✕
              </button>}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4">
            
            

            
            <AvailabilityCalendar unitId={unitId} onSelectRange={handleRangeSelect} checkDateRange={true} selectedStartDate={startDate} selectedEndDate={endDate} disableNightMode={true} requiredDomos={requiredDomos} hoverDate={hoverDate} onHoverDate={setHoverDate} />
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Check-in: 16:00 hrs</span>
                <span>Check-out: 12:00 hrs</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>;
};