
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CalendarRange } from "lucide-react";
import { AvailabilityCalendar } from "@/components/unit-detail/AvailabilityCalendar";

interface AvailabilityCalendarSheetProps {
  unitId: string;
  onSelectDate: (date: Date) => void;
}

export const AvailabilityCalendarSheet = ({ unitId, onSelectDate }: AvailabilityCalendarSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="mb-4 w-full flex items-center justify-center gap-2">
          <CalendarRange className="h-4 w-4" />
          Ver fechas disponibles
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] sm:max-w-lg mx-auto rounded-t-xl">
        <SheetHeader>
          <SheetTitle>Fechas disponibles</SheetTitle>
          <SheetDescription>
            Revisa nuestra disponibilidad para planificar tu estadía
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <AvailabilityCalendar 
            unitId={unitId} 
            onSelectDate={(date) => {
              onSelectDate(date);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
