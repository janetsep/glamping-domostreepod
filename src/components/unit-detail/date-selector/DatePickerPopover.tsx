
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AvailabilityCalendar } from "../AvailabilityCalendar";
import { ReactNode } from "react";

interface DatePickerPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  unitId: string;
  onSelectDate: (date: Date | undefined) => void;
  selectedStartDate?: Date | null;
  selectedEndDate?: Date | null;
  checkDateRange?: boolean;
  initialMonth?: Date;
}

export const DatePickerPopover = ({
  open,
  onOpenChange,
  children,
  unitId,
  onSelectDate,
  selectedStartDate,
  selectedEndDate,
  checkDateRange = false,
  initialMonth
}: DatePickerPopoverProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
        <div className="p-3">
          <AvailabilityCalendar 
            unitId={unitId}
            onSelectDate={onSelectDate}
            checkDateRange={checkDateRange}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            initialMonth={initialMonth}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
