
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  isLoading: boolean;
}

export const CalendarHeader = ({ 
  currentMonth, 
  onPreviousMonth, 
  onNextMonth, 
  isLoading 
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousMonth}
        disabled={isLoading}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="font-medium capitalize">
        {format(currentMonth, "MMMM yyyy", { locale: es })}
      </h2>
      <Button
        variant="outline"
        size="sm"
        onClick={onNextMonth}
        disabled={isLoading}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
