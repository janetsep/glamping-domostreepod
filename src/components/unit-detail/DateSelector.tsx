
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
                Selecciona las fechas de entrada y salida para verificar la disponibilidad automáticamente
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
              onSelect={onStartDateChange}
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
              onSelect={onEndDateChange}
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
