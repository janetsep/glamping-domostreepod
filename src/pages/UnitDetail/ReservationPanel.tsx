
import { GlampingUnit } from "@/lib/supabase";
import { Activity, ThemedPackage } from "@/types";
import { ReservationForm } from "./components/ReservationForm";
import { QuoteSummary } from "./components/QuoteSummary";
import { ReservationProgress } from "@/components/unit-detail/ReservationProgress";
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
  alternativeDates = [],
  getCurrentStep,
  isReservationConfirmed = false
}: ReservationPanelProps) => {
  // Efecto para depurar cambios en las fechas
  useEffect(() => {
    console.log('🔍 [ReservationPanel] Fechas actualizadas:', {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString()
    });
  }, [startDate, endDate]);

  const handleCalendarDateSelect = (date: Date) => {
    console.log('🔍 [ReservationPanel] handleCalendarDateSelect llamado con:', date.toISOString());
    setStartDate(date);
    if (endDate && endDate <= date) {
      console.log('🔍 [ReservationPanel] Reiniciando fecha de fin porque es anterior o igual a la nueva fecha de inicio');
      setEndDate(undefined);
    }
  };

  const handleAlternativeDateSelect = (start: Date, end: Date) => {
    console.log('🔍 [ReservationPanel] handleAlternativeDateSelect llamado con:', {
      start: start.toISOString(),
      end: end.toISOString()
    });
    setStartDate(start);
    setEndDate(end);
  };

  const currentStep = getCurrentStep ? getCurrentStep() : 1;

  return (
    <>
      {/* Indicador de progreso */}
      <ReservationProgress 
        currentStep={currentStep}
        showQuote={showQuote}
        isProcessingPayment={isProcessingPayment}
        isReservationConfirmed={isReservationConfirmed}
      />

      <h2 className="text-2xl font-display font-bold mb-6">
        Reserva tu experiencia en Domos TreePod
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
            adults={adults}
            children={children}
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
    </>
  );
};
