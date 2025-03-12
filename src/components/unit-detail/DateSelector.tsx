
import { DateSelectionHeader } from "./date-selector/DateSelectionHeader";
import { DatePickerButton } from "./date-selector/DatePickerButton";
import { DatePickerPopover } from "./date-selector/DatePickerPopover";
import { useDateSelection } from "./date-selector/useDateSelection";

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
    handleEndDateSelect
  } = useDateSelection({
    unitId,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange
  });

  // Debug logging
  console.log("DateSelector rendering with startDate:", startDate, "endDate:", endDate);
  console.log("Calendar states - startOpen:", startCalendarOpen, "endOpen:", endCalendarOpen);

  return (
    <div className="space-y-2 pointer-events-auto">
      <DateSelectionHeader />
      
      <div className="grid grid-cols-2 gap-4 pointer-events-auto">
        <DatePickerPopover
          open={startCalendarOpen}
          onOpenChange={setStartCalendarOpen}
          unitId={unitId}
          onSelectDate={handleStartDateSelect}
          selectedStartDate={startDate}
          selectedEndDate={endDate}
        >
          <DatePickerButton
            date={startDate}
            placeholder="Fecha de entrada"
            onClick={() => {
              console.log("DateSelector: opening start calendar");
              setStartCalendarOpen(true);
              setEndCalendarOpen(false); // Close the other calendar
            }}
          />
        </DatePickerPopover>

        <DatePickerPopover
          open={endCalendarOpen}
          onOpenChange={setEndCalendarOpen}
          unitId={unitId}
          onSelectDate={handleEndDateSelect}
          checkDateRange={true}
          selectedStartDate={startDate}
          selectedEndDate={endDate}
          initialMonth={endDateCalendarMonth}
        >
          <DatePickerButton
            date={endDate}
            placeholder="Fecha de salida"
            onClick={() => {
              console.log("DateSelector: opening end calendar");
              setEndCalendarOpen(true);
              setStartCalendarOpen(false); // Close the other calendar
            }}
            disabled={!startDate}
          />
        </DatePickerPopover>
      </div>
      
      {startDate && !endDate && (
        <div className="text-sm text-amber-600 mt-1">
          Selecciona una fecha de salida para completar tu reserva
        </div>
      )}
    </div>
  );
};
