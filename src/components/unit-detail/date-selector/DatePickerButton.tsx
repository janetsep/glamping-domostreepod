import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AvailabilityCalendar } from "../AvailabilityCalendar";

interface DatePickerButtonProps {
  label: string;
  date?: Date;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectDate: (date: Date | undefined) => void;
  unitId: string;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  disabled?: boolean;
  initialMonth?: Date;
  checkDateRange?: boolean;
  requiredDomos?: number;
}

export const DatePickerButton = ({
  label,
  date,
  isOpen,
  onOpenChange,
  onSelectDate,
  unitId,
  selectedStartDate,
  selectedEndDate,
  disabled = false,
  initialMonth,
  checkDateRange = false,
  requiredDomos = 1
}: DatePickerButtonProps) => {
  const handleRangeSelect = (range: { startDate: Date | undefined, endDate: Date | undefined }) => {
    console.log('🔍 [DatePickerButton] handleRangeSelect llamado con:', {
      startDate: range.startDate?.toISOString(),
      endDate: range.endDate?.toISOString()
    });
    
    // Si estamos seleccionando la fecha de inicio
    if (!selectedStartDate) {
      onSelectDate(range.startDate);
    } 
    // Si estamos seleccionando la fecha de fin
    else if (selectedStartDate && !selectedEndDate) {
      onSelectDate(range.endDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${
            !date && "text-muted-foreground"
          }`}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale: es })
          ) : (
            <span>{label}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 w-[350px] sm:w-[400px] md:w-[450px]">
          <AvailabilityCalendar 
            unitId={unitId}
            onSelectRange={handleRangeSelect}
            checkDateRange={checkDateRange}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            initialMonth={initialMonth}
            disableNightMode={true}
            requiredDomos={requiredDomos}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
