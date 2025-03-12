
import { Activity, ThemedPackage } from "@/types";
import { GlampingUnit } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AvailabilityCalendarSheet } from "../../AvailabilityCalendarSheet";
import { ReservationTabs } from "../../ReservationTabs";
import { AlternativeDates } from "@/components/unit-detail/AlternativeDates";

interface ReservationFormProps {
  displayUnit: GlampingUnit;
  startDate?: Date;
  endDate?: Date;
  onDateSelect: (date: Date) => void;
  setEndDate: (date: Date | undefined) => void; // Add this prop
  guests: number;
  setGuests: (guests: number) => void;
  setAdults?: (adults: number) => void;
  setChildren?: (children: number) => void;
  requiredDomos?: number;
  isAvailable: boolean | null;
  onReservation: () => void;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  onActivityToggle: (activity: Activity) => void;
  onPackageToggle: (pkg: ThemedPackage) => void;
  activitiesTotal: number;
  packagesTotal: number;
  reservationTab: string;
  setReservationTab: (tab: string) => void;
  isPartialAvailability?: boolean;
  availableDomos?: number;
  alternativeDates?: {startDate: Date, endDate: Date}[];
  onAlternativeDateSelect: (start: Date, end: Date) => void;
}

export const ReservationForm = ({
  displayUnit,
  startDate,
  endDate,
  onDateSelect,
  setEndDate,
  guests,
  setGuests,
  setAdults,
  setChildren,
  requiredDomos = 1,
  isAvailable,
  onReservation,
  selectedActivities,
  selectedPackages,
  onActivityToggle,
  onPackageToggle,
  activitiesTotal,
  packagesTotal,
  reservationTab,
  setReservationTab,
  isPartialAvailability = false,
  availableDomos = 0,
  alternativeDates = [],
  onAlternativeDateSelect
}: ReservationFormProps) => {
  return (
    <div className="space-y-4">
      <AvailabilityCalendarSheet 
        unitId={displayUnit.id} 
        onSelectDate={onDateSelect}
        selectedStartDate={startDate}
        selectedEndDate={endDate}
      />
      
      <ReservationTabs
        tab={reservationTab}
        onTabChange={setReservationTab}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onDateSelect}
        onEndDateChange={setEndDate}
        maxGuests={displayUnit.max_guests}
        guests={guests}
        onGuestsChange={setGuests}
        onAdultsChange={setAdults}
        onChildrenChange={setChildren}
        isAvailable={isAvailable}
        selectedActivities={selectedActivities}
        onActivityToggle={onActivityToggle}
        activitiesTotal={activitiesTotal}
        selectedPackages={selectedPackages}
        onPackageToggle={onPackageToggle}
        packagesTotal={packagesTotal}
        unitId={displayUnit.id}
      />

      <div className="mt-4 text-sm">
        {isPartialAvailability && isAvailable === false ? (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium">Disponibilidad limitada</p>
              <p>
                Solo tenemos <strong>{availableDomos}</strong> domos disponibles para las fechas seleccionadas, pero tu reserva requiere <strong>{requiredDomos}</strong> domos.
              </p>
            </AlertDescription>
          </Alert>
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

      <Button 
        className="w-full mt-2" 
        size="lg"
        onClick={onReservation}
        disabled={!startDate || !endDate || (isAvailable === false && !isPartialAvailability)}
      >
        {isAvailable === true ? 'Cotizar estadía' : 'Verificar disponibilidad'}
      </Button>
      
      {(selectedActivities.length > 0 || selectedPackages.length > 0) && (
        <div className="text-sm text-center mt-2 text-primary">
          Has seleccionado {selectedActivities.length} actividades y {selectedPackages.length} paquetes.
        </div>
      )}
    </div>
  );
};
