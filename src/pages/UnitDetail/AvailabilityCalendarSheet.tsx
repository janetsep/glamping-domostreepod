import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface AvailabilityCalendarSheetProps {
  unitId: string;
  onSelectRange: (range: { startDate: Date | undefined; endDate: Date | undefined }) => void;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  requiredDomos?: number;
}

export const AvailabilityCalendarSheet = ({
  unitId,
  onSelectRange,
  selectedStartDate,
  selectedEndDate,
  requiredDomos = 1
}: AvailabilityCalendarSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(selectedStartDate);
  const [endDate, setEndDate] = useState<Date | undefined>(selectedEndDate);
  const { toast } = useToast();

  // Efecto para sincronizar las fechas seleccionadas con las props
  useEffect(() => {
    console.log('🔍 [AvailabilityCalendarSheet] Props actualizadas:', {
      selectedStartDate: selectedStartDate?.toISOString(),
      selectedEndDate: selectedEndDate?.toISOString()
    });
    setStartDate(selectedStartDate);
    setEndDate(selectedEndDate);
  }, [selectedStartDate, selectedEndDate]);

  // Efecto para depurar cambios en las fechas locales
  useEffect(() => {
    console.log('🔍 [AvailabilityCalendarSheet] Estado local actualizado:', {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString()
    });
  }, [startDate, endDate]);

  const handleSelect = (date: Date | undefined) => {
    console.log('🔍 [AvailabilityCalendarSheet] handleSelect llamado con:', date?.toISOString());

    if (!date) {
      setStartDate(undefined);
      setEndDate(undefined);
      onSelectRange({ startDate: undefined, endDate: undefined });
      return;
    }

    if (!startDate || (startDate && endDate)) {
      // Si no hay fecha de inicio o ya hay un rango completo, empezar nuevo rango
      setStartDate(date);
      setEndDate(undefined);
      onSelectRange({ startDate: date, endDate: undefined });
    } else {
      // Si ya hay fecha de inicio, establecer fecha de fin
      if (date < startDate) {
        // Si la fecha seleccionada es anterior a la fecha de inicio, intercambiar
        setEndDate(startDate);
        setStartDate(date);
        onSelectRange({ startDate: date, endDate: startDate });
      } else {
        setEndDate(date);
        onSelectRange({ startDate, endDate: date });
      }
      // Cerrar el calendario después de seleccionar ambas fechas
      setIsOpen(false);
    }
  };

  const formatDateRange = () => {
    if (!startDate) return "Seleccionar fechas";
    if (!endDate) return format(startDate, "PPP", { locale: es });
    return `${format(startDate, "PPP", { locale: es })} - ${format(endDate, "PPP", { locale: es })}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !startDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Selecciona tus fechas</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Calendar
            mode="range"
            selected={{ from: startDate, to: endDate }}
            onSelect={(range) => {
              console.log('🔍 [AvailabilityCalendarSheet] Calendar onSelect:', range);
              if (range?.from) {
                handleSelect(range.from);
              }
              if (range?.to) {
                handleSelect(range.to);
              }
            }}
            locale={es}
            numberOfMonths={2}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
            className="rounded-md border"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};