
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DatePickerButtonProps {
  date?: Date;
  placeholder: string;
  onClick: () => void;
  disabled?: boolean;
}

export const DatePickerButton = ({
  date,
  placeholder,
  onClick,
  disabled = false
}: DatePickerButtonProps) => {
  return (
    <Button
      variant="outline"
      className={`w-full justify-start text-left font-normal ${
        !date && "text-muted-foreground"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? (
        format(date, "PPP", { locale: es })
      ) : (
        <span>{placeholder}</span>
      )}
    </Button>
  );
};
