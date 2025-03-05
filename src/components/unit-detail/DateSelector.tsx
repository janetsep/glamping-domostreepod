
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCallback, useEffect, useState } from "react";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { checkGeneralAvailability } from "@/hooks/reservations/utils/availabilityChecker";
import { toast } from "@/components/ui/use-toast";

interface DateSelectorProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  unitId: string;
}

export const DateSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  unitId,
}: DateSelectorProps) => {
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  // Check availability for a specific date
  const checkDateAvailability = useCallback(async (date: Date): Promise<boolean> => {
    try {
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const { isAvailable } = await checkGeneralAvailability(date, dayEnd)
        .catch(() => ({ isAvailable: false, availableUnits: 0, totalUnits: 4 }));
      
      return isAvailable;
    } catch (error) {
      console.error("Error checking date availability:", error);
      return false;
    }
  }, []);

  // Handle start date selection
  const handleStartDateSelect = async (date: Date | undefined) => {
    if (date) {
      const isAvailable = await checkDateAvailability(date);
      if (isAvailable) {
        onStartDateChange(date);
        
        // If the end date is before the new start date, reset it
        if (endDate && endDate <= date) {
          onEndDateChange(undefined);
        }
        
        // Close the start calendar and open the end calendar if no end date is selected
        setStartCalendarOpen(false);
        if (!endDate) {
          setTimeout(() => setEndCalendarOpen(true), 300); // Open end calendar after a short delay
        }
      } else {
        // Date not available, show message
        toast({
          title: "Fecha no disponible",
          description: "No hay domos disponibles para esta fecha.",
          variant: "destructive"
        });
      }
    } else {
      onStartDateChange(undefined);
    }
  };

  // Handle end date selection
  const handleEndDateSelect = async (date: Date | undefined) => {
    if (date && startDate) {
      // Check if all dates in the range are available
      const dateRange = [];
      let currentDate = new Date(startDate);
      
      while (currentDate <= date) {
        dateRange.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Check each date in the range
      let allDatesAvailable = true;
      for (const rangeDate of dateRange) {
        const available = await checkDateAvailability(rangeDate);
        if (!available) {
          allDatesAvailable = false;
          break;
        }
      }
      
      if (allDatesAvailable) {
        onEndDateChange(date);
        setEndCalendarOpen(false);
      } else {
        toast({
          title: "Rango no disponible",
          description: "Algunas fechas en el rango seleccionado no están disponibles.",
          variant: "destructive"
        });
      }
    } else {
      onEndDateChange(undefined);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Fechas de estadía</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Selecciona las fechas de entrada y salida. El sistema verificará automáticamente
                la disponibilidad en todos nuestros domos (4 en total).
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                !startDate && "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, "PPP", { locale: es })
              ) : (
                <span>Fecha de entrada</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3">
              <AvailabilityCalendar 
                unitId={unitId}
                onSelectDate={handleStartDateSelect}
                selectedStartDate={startDate}
                selectedEndDate={endDate}
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                !endDate && "text-muted-foreground"
              }`}
              disabled={!startDate}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? (
                format(endDate, "PPP", { locale: es })
              ) : (
                <span>Fecha de salida</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3">
              <AvailabilityCalendar 
                unitId={unitId}
                onSelectDate={handleEndDateSelect}
                checkDateRange={true}
                selectedStartDate={startDate}
                selectedEndDate={endDate}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {startDate && !endDate && (
        <div className="text-sm text-amber-600 mt-1">
          Selecciona una fecha de salida para completar tu reserva
        </div>
      )}
    </div>
  );
};
