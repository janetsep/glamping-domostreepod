import { Button } from "@/components/ui/button";
import { GlampingUnit } from "@/lib/supabase";
import { Activity, ThemedPackage } from "@/types";
import { AvailabilityCalendarSheet } from "./AvailabilityCalendarSheet";
import { ReservationFormSection } from "./components/ReservationFormSection";
import { ReservationActions } from "./components/ReservationActions";
import { ReservationQuoteView } from "./components/ReservationQuoteView";
interface ReservationPanelProps {
  displayUnit: GlampingUnit;
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
  showQuote: boolean;
  quote: any;
  onReservation: () => void;
  onNewQuote: () => void;
  onConfirmReservation: () => void;
  isProcessingPayment: boolean;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  onActivityToggle: (activity: Activity) => void;
  onPackageToggle: (pkg: ThemedPackage) => void;
  activitiesTotal: number;
  packagesTotal: number;
  getUpdatedQuoteTotal: () => number;
  reservationTab: string;
  setReservationTab: (tab: string) => void;
  isPartialAvailability?: boolean;
  availableDomos?: number;
  alternativeDates?: {
    startDate: Date;
    endDate: Date;
  }[];
}
export const ReservationPanel = ({
  displayUnit,
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
  showQuote,
  quote,
  onReservation,
  onNewQuote,
  onConfirmReservation,
  isProcessingPayment,
  selectedActivities,
  selectedPackages,
  onActivityToggle,
  onPackageToggle,
  activitiesTotal,
  packagesTotal,
  getUpdatedQuoteTotal,
  reservationTab,
  setReservationTab,
  isPartialAvailability = false,
  availableDomos = 0,
  alternativeDates = []
}: ReservationPanelProps) => {
  const handleCalendarDateSelect = (date: Date) => {
    setStartDate(date);
    if (endDate && endDate <= date) {
      setEndDate(undefined);
    }
  };
  const handleAlternativeDateSelect = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };
  return <>
      <h2 className="text-2xl font-display font-bold mb-6">Reserva tu experiencia</h2>
      
      <AvailabilityCalendarSheet unitId={displayUnit.id} onSelectDate={handleCalendarDateSelect} selectedStartDate={startDate} selectedEndDate={endDate} />
      
      <div className="space-y-4">
        {!showQuote ? <>
            <ReservationFormSection reservationTab={reservationTab} onTabChange={setReservationTab} startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} maxGuests={displayUnit.max_guests} guests={guests} onGuestsChange={setGuests} onAdultsChange={setAdults} onChildrenChange={setChildren} isAvailable={isAvailable} selectedActivities={selectedActivities} onActivityToggle={onActivityToggle} activitiesTotal={activitiesTotal} selectedPackages={selectedPackages} onPackageToggle={onPackageToggle} packagesTotal={packagesTotal} unitId={displayUnit.id} isPartialAvailability={isPartialAvailability} availableDomos={availableDomos} requiredDomos={requiredDomos} alternativeDates={alternativeDates} onAlternativeDateSelect={handleAlternativeDateSelect} />

            <ReservationActions onReservation={onReservation} isAvailable={isAvailable} startDate={startDate} endDate={endDate} selectedActivities={selectedActivities} selectedPackages={selectedPackages} isPartialAvailability={isPartialAvailability} />
          </> : quote && <ReservationQuoteView quote={quote} isAvailable={isAvailable || false} onNewQuote={onNewQuote} onConfirmReservation={onConfirmReservation} isProcessingPayment={isProcessingPayment} selectedActivities={selectedActivities} selectedPackages={selectedPackages} getUpdatedQuoteTotal={getUpdatedQuoteTotal} requiredDomos={requiredDomos} startDate={startDate} endDate={endDate} guests={guests} />}
      </div>
    </>;
};