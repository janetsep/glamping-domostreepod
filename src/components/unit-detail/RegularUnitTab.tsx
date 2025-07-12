import { DateSelector } from "./DateSelector";
import { GuestSelector } from "./GuestSelector";
import { AvailabilityAlerts } from "./AvailabilityAlerts";

interface RegularUnitTabProps {
  unitId: string;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  guests: number;
  onGuestsChange: (guests: number) => void;
  adults?: number;
  children?: number;
  onAdultsChange?: (adults: number) => void;
  onChildrenChange?: (children: number) => void;
  requiredDomos?: number;
  isAvailable: boolean | null;
  availableDomos?: number;
}

export const RegularUnitTab = ({
  unitId,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  guests,
  onGuestsChange,
  adults = 2,
  children = 0,
  onAdultsChange,
  onChildrenChange,
  requiredDomos,
  isAvailable,
  availableDomos
}: RegularUnitTabProps) => {
  return (
    <div className="space-y-4">
      <DateSelector
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        unitId={unitId}
        requiredDomos={requiredDomos}
      />
      
      <GuestSelector
        value={guests}
        onChange={onGuestsChange}
        maxGuests={16}
        availableDomos={availableDomos}
        adults={adults}
        children={children}
        onAdultsChange={onAdultsChange}
        onChildrenChange={onChildrenChange}
      />
      
      <AvailabilityAlerts
        isAvailable={isAvailable}
        availableDomos={availableDomos}
        requiredDomos={requiredDomos}
        guests={guests}
      />
    </div>
  );
};