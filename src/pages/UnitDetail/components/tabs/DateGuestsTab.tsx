
import { DateSelector } from "@/components/unit-detail/DateSelector";
import { GuestSelector } from "@/components/unit-detail/GuestSelector";
import { Alert } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface DateGuestsTabProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  maxGuests: number;
  guests: number;
  onGuestsChange: (guests: number) => void;
  onAdultsChange?: (adults: number) => void;
  onChildrenChange?: (children: number) => void;
  isAvailable: boolean | null;
  unitId: string;
}

export const DateGuestsTab = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  maxGuests,
  guests,
  onGuestsChange,
  onAdultsChange,
  onChildrenChange,
  isAvailable,
  unitId
}: DateGuestsTabProps) => {
  return (
    <div className="space-y-4">
      <DateSelector
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        unitId={unitId}
      />
      
      <GuestSelector
        maxGuests={maxGuests}
        guests={guests}
        onGuestsChange={onGuestsChange}
        onAdultsChange={onAdultsChange}
        onChildrenChange={onChildrenChange}
        maxDomos={4}
      />
      
      {isAvailable === false && (
        <div className="p-3 bg-red-50 border border-red-100 rounded text-red-800 text-sm mt-4">
          No hay disponibilidad para las fechas seleccionadas. Por favor, selecciona otras fechas.
        </div>
      )}
    </div>
  );
};
