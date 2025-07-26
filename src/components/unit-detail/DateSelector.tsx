import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { DatePickerButton } from "./date-selector/DatePickerButton";
import { DateRangePicker } from "./date-selector/DateRangePicker";
import { useDateSelection } from "./hooks/useDateSelection";

interface DateSelectorProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  unitId: string;
  requiredDomos?: number;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  unitId,
  requiredDomos = 1
}) => {
  const {
    startCalendarOpen,
    setStartCalendarOpen,
    endCalendarOpen,
    setEndCalendarOpen,
    endDateCalendarMonth,
    handleStartDateSelect,
    handleEndDateSelect
  } = useDateSelection({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    requiredDomos
  });


  return (
    <div className="space-y-4">
      {/* Nuevo selector de rango de fechas unificado */}
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        unitId={unitId}
        requiredDomos={requiredDomos}
      />
      
      {/* Fallback a selectores individuales si es necesario */}
      <div className="hidden">
        <div>
          <Label htmlFor="start-date" className="block mb-2">
            Fecha de entrada
          </Label>
          <DatePickerButton
            label="Seleccionar fecha de entrada"
            date={startDate}
            isOpen={startCalendarOpen}
            onOpenChange={setStartCalendarOpen}
            onSelectDate={handleStartDateSelect}
            unitId={unitId}
            requiredDomos={requiredDomos}
          />
        </div>

        <div>
          <Label htmlFor="end-date" className="block mb-2">
            Fecha de salida
          </Label>
          <DatePickerButton
            label="Seleccionar fecha de salida"
            date={endDate}
            isOpen={endCalendarOpen}
            onOpenChange={setEndCalendarOpen}
            onSelectDate={handleEndDateSelect}
            unitId={unitId}
            selectedStartDate={startDate}
            initialMonth={endDateCalendarMonth}
            checkDateRange={true}
            disabled={!startDate}
            requiredDomos={requiredDomos}
          />
        </div>
      </div>
    </div>
  );
};