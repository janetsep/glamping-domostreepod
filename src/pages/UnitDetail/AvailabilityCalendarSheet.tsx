
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AvailabilityCalendar } from "@/components/unit-detail/AvailabilityCalendar";

interface AvailabilityCalendarSheetProps {
  unitId: string;
  onSelectDate?: (date: Date) => void;
  selectedStartDate?: Date | null;
  selectedEndDate?: Date | null;
}

export const AvailabilityCalendarSheet = ({
  unitId,
  onSelectDate,
  selectedStartDate,
  selectedEndDate
}: AvailabilityCalendarSheetProps) => {
  const initialMonth = selectedStartDate || new Date(); // Use selectedStartDate as the initial month if available

  return <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full mb-6 flex gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>Ver disponibilidad en Calendario</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] pt-8 overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Disponibilidad</SheetTitle>
          <SheetDescription>
            Consulta la disponibilidad de nuestros domos. Los días en verde están disponibles para reserva.
          </SheetDescription>
        </SheetHeader>
        
        <div className="max-w-lg mx-auto">
          <AvailabilityCalendar 
            unitId={unitId} 
            onSelectDate={onSelectDate} 
            selectedStartDate={selectedStartDate} 
            selectedEndDate={selectedEndDate} 
            initialMonth={initialMonth} 
          />
        </div>
      </SheetContent>
    </Sheet>;
};
