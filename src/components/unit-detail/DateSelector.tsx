
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
import { useCallback, useEffect } from "react";
import { checkGeneralAvailability } from "@/hooks/reservations/utils/availabilityChecker";

interface DateSelectorProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export const DateSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateSelectorProps) => {
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

  // Handle start date selection with availability check
  const handleStartDateSelect = async (date: Date | undefined) => {
    if (date) {
      const isAvailable = await checkDateAvailability(date);
      if (isAvailable) {
        onStartDateChange(date);
        // If there's no end date or the end date is before the new start date,
        // set a default end date 2 days later
        if (!endDate || endDate <= date) {
          const newEndDate = new Date(date);
          newEndDate.setDate(newEndDate.getDate() + 2);
          onEndDateChange(newEndDate);
        }
      } else {
        // Date not available, don't update
        console.log("Selected start date is not available");
      }
    } else {
      onStartDateChange(undefined);
    }
  };

  // Handle end date selection with availability check
  const handleEndDateSelect = async (date: Date | undefined) => {
    if (date) {
      const isAvailable = await checkDateAvailability(date);
      if (isAvailable) {
        onEndDateChange(date);
      } else {
        // Date not available, don't update
        console.log("Selected end date is not available");
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
                Selecciona las fechas de entrada y salida para verificar la disponibilidad automáticamente.
                Solo podrás seleccionar fechas disponibles.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Popover>
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
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateSelect}
              disabled={(date) =>
                date < new Date() || (endDate ? date >= endDate : false)
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                !endDate && "text-muted-foreground"
              }`}
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
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDateSelect}
              disabled={(date) =>
                !startDate || date <= startDate || date <= new Date()
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
