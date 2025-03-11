
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
    
    // Solo cerramos el popover automáticamente para la fecha de inicio
    // No lo cerramos para la selección de fecha final para permitir que el usuario
    // pueda seleccionar un rango completo
    if (!checkDateRange) {
      setTimeout(() => onOpenChange(false), 200);
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0" 
        align="start"
        side="bottom"
        sideOffset={4}
        avoidCollisions={true}
      >
        <div className="p-3">
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
