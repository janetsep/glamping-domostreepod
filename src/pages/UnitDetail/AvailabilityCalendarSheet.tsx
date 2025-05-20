
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AvailabilityCalendar } from "@/components/unit-detail/AvailabilityCalendar";

interface AvailabilityCalendarSheetProps {
  unitId: string;
  onSelectDate?: (date: Date) => void;
  selectedStartDate?: Date | null;
  selectedEndDate?: Date | null;
  requiredDomos?: number;
}

export const AvailabilityCalendarSheet = ({
  unitId,
  onSelectDate,
  selectedStartDate,
  selectedEndDate,
  requiredDomos = 1
}: AvailabilityCalendarSheetProps) => {
  const initialMonth = selectedStartDate || new Date(); // Use selectedStartDate as the initial month if available
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full mb-6 flex gap-2">
          <Calendar className="h-4 w-4" />
          <span>Ver calendario de disponibilidad</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[100vh] pt-8 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Disponibilidad</SheetTitle>
          <SheetDescription className="text-base">
            Consulta la disponibilidad de nuestros domos. 
            Los días en verde están disponibles para reserva y cuentan con suficientes domos para tu grupo.
          </SheetDescription>
        </SheetHeader>
        
        <div className="max-w-xl mx-auto">
          <AvailabilityCalendar 
            unitId={unitId} 
            onSelectDate={onSelectDate}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            initialMonth={initialMonth}
            disableNightMode={true}
            requiredDomos={requiredDomos}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
