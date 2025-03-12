
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
  const handleSelectDate = (date: Date) => {
    console.log("DatePickerPopover: selecting date", date);
    onSelectDate(date);
    
    // Only close the popover automatically for start date selection
    // Don't close it for end date selection to allow the user to
    // select a complete range
    if (!checkDateRange) {
      setTimeout(() => onOpenChange(false), 300);
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 calendar-popover" 
        align="start"
        side="bottom"
        sideOffset={4}
        avoidCollisions={true}
        onClick={(e) => {
          // Prevent the popover from closing when clicking inside it
          e.stopPropagation();
        }}
      >
        <div 
          className="p-3 calendar-container" 
          onClick={(e) => {
            console.log("Calendar container clicked");
            e.stopPropagation();
          }}
        >
          <AvailabilityCalendar 
            unitId={unitId}
            onSelectDate={handleSelectDate}
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
