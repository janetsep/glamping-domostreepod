
import { ReservationTabs } from "../ReservationTabs";
import { AlternativeDates } from "@/components/unit-detail/AlternativeDates";
import { Info } from "lucide-react";
import { Activity, ThemedPackage } from "@/types";

interface ReservationFormSectionProps {
  reservationTab: string;
  onTabChange: (tab: string) => void;
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
  selectedActivities: Activity[];
  onActivityToggle: (activity: Activity) => void;
  activitiesTotal: number;
  selectedPackages: ThemedPackage[];
  onPackageToggle: (pkg: ThemedPackage) => void;
  packagesTotal: number;
  unitId: string;
  isPartialAvailability?: boolean;
  availableDomos?: number;
  requiredDomos: number;
  alternativeDates?: {startDate: Date, endDate: Date}[];
  onAlternativeDateSelect: (start: Date, end: Date) => void;
}

export const ReservationFormSection = ({
  reservationTab,
  onTabChange,
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
  selectedActivities,
  onActivityToggle,
  activitiesTotal,
  selectedPackages,
  onPackageToggle,
  packagesTotal,
  unitId,
  isPartialAvailability = false,
  availableDomos = 0,
  requiredDomos,
  alternativeDates = [],
  onAlternativeDateSelect
}: ReservationFormSectionProps) => {
  return (
    <>
      <ReservationTabs
        tab={reservationTab}
        onTabChange={onTabChange}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        maxGuests={maxGuests}
        guests={guests}
        onGuestsChange={onGuestsChange}
        onAdultsChange={onAdultsChange}
        onChildrenChange={onChildrenChange}
        isAvailable={isAvailable}
        selectedActivities={selectedActivities}
        onActivityToggle={onActivityToggle}
        activitiesTotal={activitiesTotal}
        selectedPackages={selectedPackages}
        onPackageToggle={onPackageToggle}
        packagesTotal={packagesTotal}
        unitId={unitId}
      />

      <div className="mt-4 text-sm">
        {isPartialAvailability && isAvailable === false ? (
          <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
            <p className="font-medium text-amber-800 flex items-center gap-1.5">
              <Info className="h-4 w-4" />
              Disponibilidad limitada
            </p>
            <p className="text-amber-700 mt-1">
              Solo tenemos <strong>{availableDomos}</strong> domos disponibles para las fechas seleccionadas, pero tu reserva requiere <strong>{requiredDomos}</strong> domos.
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
            <p className="font-medium text-blue-800">Información de domos</p>
            <p className="text-blue-700 mt-1">
              Se necesitarán <strong>{requiredDomos}</strong> domos para tu reserva.
            </p>
          </div>
        )}
      </div>
      
      {isAvailable === false && alternativeDates.length > 0 && (
        <AlternativeDates 
          alternativeDates={alternativeDates}
          onSelectDate={onAlternativeDateSelect}
          requiredDomos={requiredDomos}
        />
      )}

      <div className="mt-4 text-sm text-gray-600 p-3 bg-amber-50 border border-amber-100 rounded">
        <p className="font-medium text-amber-800 mb-1">Política de reserva</p>
        <p>Pago total por adelantado para confirmar tu reserva. Check-in desde las 15:00, check-out hasta las 12:00.</p>
      </div>
    </>
  );
};
