
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDateSelection } from "./hooks/useDateSelection";
import { DatePickerButton } from "./date-selector/DatePickerButton";

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
  const {
    startCalendarOpen,
    setStartCalendarOpen,
    endCalendarOpen,
    setEndCalendarOpen,
    endDateCalendarMonth,
    handleStartDateSelect,
    handleEndDateSelect,
  } = useDateSelection({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
  });

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
        <DatePickerButton
          label="Fecha de entrada"
          date={startDate}
          isOpen={startCalendarOpen}
          onOpenChange={setStartCalendarOpen}
          onSelectDate={handleStartDateSelect}
          unitId={unitId}
          selectedStartDate={startDate}
          selectedEndDate={endDate}
        />

        <DatePickerButton
          label="Fecha de salida"
          date={endDate}
          isOpen={endCalendarOpen}
          onOpenChange={setEndCalendarOpen}
          onSelectDate={handleEndDateSelect}
          unitId={unitId}
          selectedStartDate={startDate}
          selectedEndDate={endDate}
          disabled={!startDate}
          initialMonth={endDateCalendarMonth}
          checkDateRange={true}
        />
      </div>
      
      {startDate && !endDate && (
        <div className="text-sm text-amber-600 mt-1">
          Selecciona una fecha de salida para completar tu reserva
        </div>
      )}
    </div>
  );
};
