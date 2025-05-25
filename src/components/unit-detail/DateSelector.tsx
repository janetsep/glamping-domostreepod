import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { DatePickerButton } from "./date-selector/DatePickerButton";
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

  // Efecto para depurar cambios en las fechas
  useEffect(() => {
    console.log('🔍 [DateSelector] Fechas actualizadas:', {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString()
    });
  }, [startDate, endDate]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="start-date" className="block mb-2">
          Fecha de entrada
        </Label>
        <DatePickerButton
          label="Seleccionar fecha de entrada"
          date={startDate}
          isOpen={startCalendarOpen}
          onOpenChange={setStartCalendarOpen}
          onSelectDate={(date) => {
            console.log('🔍 [DateSelector] Selección de fecha de entrada:', date?.toISOString());
            handleStartDateSelect(date);
          }}
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
          onSelectDate={(date) => {
            console.log('🔍 [DateSelector] Selección de fecha de salida:', date?.toISOString());
            handleEndDateSelect(date);
          }}
          unitId={unitId}
          selectedStartDate={startDate}
          initialMonth={endDateCalendarMonth}
          checkDateRange={true}
          disabled={!startDate}
          requiredDomos={requiredDomos}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Check-in: 16:00 hrs | Check-out: 12:00 hrs</p>
      </div>
    </div>
  );
};