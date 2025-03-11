
import { Button } from "@/components/ui/button";
import { GlampingUnit } from "@/lib/supabase";
import { ReservationSummary } from "@/components/unit-detail/ReservationSummary";
import { Activity, ThemedPackage } from "@/types";
import { AvailabilityCalendarSheet } from "./AvailabilityCalendarSheet";
import { ReservationTabs } from "./ReservationTabs";
import { AlternativeDates } from "@/components/unit-detail/AlternativeDates";
import { InfoCircle } from "lucide-react";

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
    // Just set the start date without automatically setting the end date
    setStartDate(date);
    
    // If there's an end date before the new start date, clear it
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
      
      {/* Available dates calendar button */}
      <AvailabilityCalendarSheet 
        unitId={displayUnit.id} 
        onSelectDate={handleCalendarDateSelect}
        selectedStartDate={startDate}
        selectedEndDate={endDate}
      />
      
      <div className="space-y-4">
        {!showQuote ? (
          <>
            <ReservationTabs
              tab={reservationTab}
              onTabChange={setReservationTab}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
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
                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <p className="font-medium text-amber-800 flex items-center gap-1.5">
                    <InfoCircle className="h-4 w-4" />
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
            
            {/* Display alternative dates if available */}
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
          </>
        ) : quote && (
          <>
            <ReservationSummary
              quote={{
                ...quote,
                totalPrice: getUpdatedQuoteTotal(),
                requiredDomos: requiredDomos
              }}
              isAvailable={isAvailable || false}
              isLoading={isProcessingPayment}
              onReserve={onNewQuote}
              onConfirm={onConfirmReservation}
              buttonText={isAvailable ? "Aceptar cotización" : "Nueva cotización"}
              selectedActivities={selectedActivities}
              selectedPackages={selectedPackages}
              hasSelectedExtras={selectedActivities.length > 0 || selectedPackages.length > 0}
            />
            <div className="text-sm text-muted-foreground mt-4">
              <p>Fechas seleccionadas:</p>
              <p>Entrada: {startDate?.toLocaleDateString()}</p>
              <p>Salida: {endDate?.toLocaleDateString()}</p>
              <p>Huéspedes: {guests}</p>
              <p>Domos necesarios: {requiredDomos}</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};
