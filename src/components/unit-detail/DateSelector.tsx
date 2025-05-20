
import { useDateSelection } from "./hooks/useDateSelection";
import { DatePickerButton } from "./date-selector/DatePickerButton";
import { Label } from "@/components/ui/label";

interface DateSelectorProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  unitId: string;
  requiredDomos?: number;
}

export const DateSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  unitId,
  requiredDomos = 1
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
    requiredDomos // Pass requiredDomos to the hook
  });

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

      <div className="text-sm text-muted-foreground">
        <p>Check-in: 15:00 hrs | Check-out: 12:00 hrs</p>
      </div>
    </div>
  );
};
