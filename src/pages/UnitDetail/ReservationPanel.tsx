
import { GlampingUnit } from "@/lib/supabase";
import { Activity, ThemedPackage } from "@/types";
import { ReservationForm } from "./components/ReservationForm";
import { QuoteSummary } from "./components/QuoteSummary";

interface ReservationPanelProps {
  displayUnit?: GlampingUnit;
  startDate?: Date;
  endDate?: Date;
  setStartDate?: (date: Date | undefined) => void;
  setEndDate?: (date: Date | undefined) => void;
  guests?: number;
  setGuests?: (guests: number) => void;
  requiredDomos?: number;
  setRequiredDomos?: (domos: number) => void;
  isAvailable?: boolean | null;
  showQuote?: boolean;
  quote?: any;
  onReservation?: () => void;
  onNewQuote?: () => void;
  onConfirmReservation?: () => void;
  isProcessingPayment?: boolean;
  selectedActivities?: Activity[];
  selectedPackages?: ThemedPackage[];
  onActivityToggle?: (activity: Activity) => void;
  onPackageToggle?: (pkg: ThemedPackage) => void;
  activitiesTotal?: number;
  packagesTotal?: number;
  getUpdatedQuoteTotal?: () => number;
  reservationTab?: string;
  setReservationTab?: (tab: string) => void;
  isPartialAvailability?: boolean;
  availableDomos?: number;
  alternativeDates?: {startDate: Date, endDate: Date}[];
  unitId?: string;
  unitType?: string;
}

export const ReservationPanel = ({
  displayUnit,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  guests = 1,
  setGuests,
  requiredDomos = 1,
  setRequiredDomos,
  isAvailable,
  showQuote,
  quote,
  onReservation,
  onNewQuote,
  onConfirmReservation,
  isProcessingPayment,
  selectedActivities = [],
  selectedPackages = [],
  onActivityToggle,
  onPackageToggle,
  activitiesTotal = 0,
  packagesTotal = 0,
  getUpdatedQuoteTotal,
  reservationTab = 'dates',
  setReservationTab,
  isPartialAvailability = false,
  availableDomos = 0,
  alternativeDates = [],
  unitId = '',
  unitType = 'domo'
}: ReservationPanelProps) => {
  
  // Si no se pasan props completas, mostramos un panel simplificado
  if (!displayUnit) {
    return (
      <>
        <h2 className="text-2xl font-display font-bold mb-6">
          Reserva tu experiencia TreePod
        </h2>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-700 mb-4">
            Selecciona fechas y número de huéspedes para iniciar tu reserva.
          </p>
          
          <div className="text-xl font-semibold text-primary">
            Desde $120.000 CLP / noche
          </div>
          
          <button className="w-full bg-primary text-white py-2 rounded-md mt-4 hover:bg-primary/90 transition-colors">
            Consultar disponibilidad
          </button>
        </div>
      </>
    );
  }
  
  const handleCalendarDateSelect = (date: Date) => {
    setStartDate && setStartDate(date);
    
    if (endDate && endDate <= date) {
      setEndDate && setEndDate(undefined);
    }
  };

  const handleAlternativeDateSelect = (start: Date, end: Date) => {
    setStartDate && setStartDate(start);
    setEndDate && setEndDate(end);
  };

  return (
    <>
      <h2 className="text-2xl font-display font-bold mb-6">
        Reserva tu experiencia TreePod
      </h2>
      
      <div className="space-y-4">
        {!showQuote ? (
          <ReservationForm 
            unitId={unitId}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            guests={guests}
            setGuests={setGuests}
            requiredDomos={requiredDomos}
            setRequiredDomos={setRequiredDomos}
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
