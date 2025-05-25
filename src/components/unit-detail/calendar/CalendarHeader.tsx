import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  isLoading?: boolean;
}

export const CalendarHeader = ({ 
  currentMonth, 
  onPreviousMonth, 
  onNextMonth, 
  isLoading = false 
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="outline"
        size="icon"
        onClick={onPreviousMonth}
        disabled={isLoading}
        className="h-10 w-10"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <h2 className="text-xl font-medium capitalize">
        {format(currentMonth, "MMMM yyyy", { locale: es })}
      </h2>
      <Button
        variant="outline"
        size="icon"
        onClick={onNextMonth}
        disabled={isLoading}
        className="h-10 w-10"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
