
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
  selectedStartDate?: Date | null;
  selectedEndDate?: Date | null;
  disabled?: boolean;
  initialMonth?: Date;
  checkDateRange?: boolean;
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
}: DatePickerButtonProps) => {
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
            onSelectDate={onSelectDate}
            checkDateRange={checkDateRange}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            initialMonth={initialMonth}
            disableNightMode={true}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
