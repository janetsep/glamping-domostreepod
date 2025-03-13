
import { GlampingUnit } from "@/lib/supabase";
import { Activity, ThemedPackage } from "@/types";
import { ReservationForm } from "./components/ReservationForm";
import { QuoteSummary } from "./components/QuoteSummary";

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
  alternativeDates?: {startDate: Date, endDate: Date}[];
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

  return (
    <>
      <h2 className="text-2xl font-display font-bold mb-6">
        Reserva tu experiencia TreePod
      </h2>
      
      <div className="space-y-4">
        {!showQuote ? (
          <ReservationForm 
            unitId={displayUnit.id}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            guests={guests}
            setGuests={setGuests}
            setAdults={setAdults}
            setChildren={setChildren}
            requiredDomos={requiredDomos}
            isAvailable={isAvailable}
            onReservation={onReservation}
            selectedActivities={selectedActivities}
            selectedPackages={selectedPackages}
            onActivityToggle={onActivityToggle}
            onPackageToggle={onPackageToggle}
            activitiesTotal={activitiesTotal}
            packagesTotal={packagesTotal}
            reservationTab={reservationTab}
            setReservationTab={setReservationTab}
            isPartialAvailability={isPartialAvailability}
            availableDomos={availableDomos}
            alternativeDates={alternativeDates}
            handleCalendarDateSelect={handleCalendarDateSelect}
            handleAlternativeDateSelect={handleAlternativeDateSelect}
          />
        ) : quote && (
          <QuoteSummary 
            quote={quote}
            isAvailable={isAvailable || false}
            isProcessingPayment={isProcessingPayment}
            onNewQuote={onNewQuote}
            onConfirmReservation={onConfirmReservation}
            selectedActivities={selectedActivities}
            selectedPackages={selectedPackages}
            getUpdatedQuoteTotal={getUpdatedQuoteTotal}
            startDate={startDate}
            endDate={endDate}
            guests={guests}
            requiredDomos={requiredDomos}
          />
        )}
      </div>
    </>
  );
};
