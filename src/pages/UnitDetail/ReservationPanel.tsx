import { GlampingUnit } from "@/lib/supabase";
import { Activity, ThemedPackage } from "@/types";
import { ReservationForm } from "./components/ReservationForm";
import { QuoteSummary } from "./components/QuoteSummary";
import { CompactReservationProgress } from "@/components/unit-detail/CompactReservationProgress";
import { useEffect } from "react";

interface ReservationPanelProps {
  displayUnit: GlampingUnit;
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  guests: number;
  setGuests: (guests: number) => void;
  adults?: number;
  children?: number;
  setAdults?: (adults: number) => void;
  setChildren?: (children: number) => void;
  requiredDomos?: number;
  selectedDomos?: number;
  setSelectedDomos?: (domos: number) => void;
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
  getCurrentStep?: () => number;
  isReservationConfirmed?: boolean;
}

export const ReservationPanel = ({
  displayUnit,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  guests,
  setGuests,
  adults = 2,
  children = 0,
  setAdults,
  setChildren,
  requiredDomos = 1,
  selectedDomos,
  setSelectedDomos,
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
  availableDomos,
  alternativeDates = [],
  getCurrentStep,
  isReservationConfirmed = false
}: ReservationPanelProps) => {
  // Debug effect only in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 [ReservationPanel] Fechas actualizadas:', {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      });
    }
  }, [startDate, endDate]);

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
    <div className="sticky top-0 h-screen overflow-y-auto bg-white border-l border-gray-200 p-5">
      <h2 className="text-xl font-display font-bold mb-3 text-sm">
        Reserva tu experiencia en Domos TreePod
      </h2>
      
      {/* Barra de progreso debajo del título */}
      <div className="mb-5">
        <CompactReservationProgress 
          currentStep={getCurrentStep ? getCurrentStep() : 1}
          showQuote={showQuote}
          isProcessingPayment={isProcessingPayment}
          isReservationConfirmed={isReservationConfirmed}
        />
      </div>
      
      <div className="space-y-3 text-sm">
        {!showQuote ? (
          <ReservationForm 
            unitId={displayUnit.id} 
            startDate={startDate} 
            endDate={endDate} 
            setStartDate={setStartDate} 
            setEndDate={setEndDate} 
            guests={guests} 
            setGuests={setGuests} 
            adults={adults}
            children={children}
            setAdults={setAdults}
            setChildren={setChildren}
            requiredDomos={requiredDomos}
            selectedDomos={selectedDomos}
            setSelectedDomos={setSelectedDomos}
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
            handleAlternativeDateSelect={handleAlternativeDateSelect}
          />
        ) : (
          quote && (
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
          )
        )}
      </div>
    </div>
  );
};
