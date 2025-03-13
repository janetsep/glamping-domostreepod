
import { Button } from "@/components/ui/button";
import { ReservationTabs } from "../ReservationTabs";
import { AlternativeDates } from "@/components/unit-detail/AlternativeDates";
import { Info } from "lucide-react";
import { AvailabilityCalendarSheet } from "../AvailabilityCalendarSheet";
import { Activity, ThemedPackage } from "@/types";

interface ReservationFormProps {
  unitId: string;
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
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
  handleCalendarDateSelect: (date: Date) => void;
  handleAlternativeDateSelect: (start: Date, end: Date) => void;
}

export const ReservationForm = ({
  unitId,
  startDate,
  endDate,
  setStartDate,
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
  handleCalendarDateSelect,
  handleAlternativeDateSelect
}: ReservationFormProps) => {
  return (
    <>
      <AvailabilityCalendarSheet 
        unitId={unitId} 
        onSelectDate={handleCalendarDateSelect}
        selectedStartDate={startDate}
        selectedEndDate={endDate}
      />
      
      <div className="space-y-4">
        <ReservationTabs
          tab={reservationTab}
          onTabChange={setReservationTab}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          maxGuests={4} // Default value for TreePod domes
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
          unitId={unitId}
        />

        <AvailabilityMessages 
          isPartialAvailability={isPartialAvailability}
          isAvailable={isAvailable}
          availableDomos={availableDomos}
          requiredDomos={requiredDomos}
        />
        
        {isAvailable === false && alternativeDates.length > 0 && (
          <AlternativeDates 
            alternativeDates={alternativeDates}
            onSelectDate={handleAlternativeDateSelect}
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
    </>
  );
};

interface AvailabilityMessagesProps {
  isPartialAvailability?: boolean;
  isAvailable: boolean | null;
  availableDomos?: number;
  requiredDomos?: number;
}

const AvailabilityMessages = ({ 
  isPartialAvailability, 
  isAvailable, 
  availableDomos, 
  requiredDomos 
}: AvailabilityMessagesProps) => {
  return (
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
  );
};
