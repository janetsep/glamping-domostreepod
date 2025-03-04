
import { Button } from "@/components/ui/button";
import { GlampingUnit } from "@/lib/supabase";
import { ReservationSummary } from "@/components/unit-detail/ReservationSummary";
import { Activity, ThemedPackage } from "@/types";
import { AvailabilityCalendarSheet } from "./AvailabilityCalendarSheet";
import { ReservationTabs } from "./ReservationTabs";

interface ReservationPanelProps {
  displayUnit: GlampingUnit;
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  guests: number;
  setGuests: (guests: number) => void;
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
}

export const ReservationPanel = ({
  displayUnit,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  guests,
  setGuests,
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
  setReservationTab
}: ReservationPanelProps) => {
  
  const handleCalendarDateSelect = (date: Date) => {
    setStartDate(date);
    const checkoutDate = new Date(date);
    checkoutDate.setDate(checkoutDate.getDate() + 2); // Default 2 night stay
    setEndDate(checkoutDate);
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
              isAvailable={isAvailable}
              selectedActivities={selectedActivities}
              onActivityToggle={onActivityToggle}
              activitiesTotal={activitiesTotal}
              selectedPackages={selectedPackages}
              onPackageToggle={onPackageToggle}
              packagesTotal={packagesTotal}
            />

            <div className="mt-8 text-sm text-gray-600 p-3 bg-amber-50 border border-amber-100 rounded">
              <p className="font-medium text-amber-800 mb-1">Política de reserva</p>
              <p>Pago total por adelantado para confirmar tu reserva. Check-in desde las 15:00, check-out hasta las 12:00.</p>
            </div>

            <Button 
              className="w-full mt-2" 
              size="lg"
              onClick={onReservation}
              disabled={!startDate || !endDate || isAvailable === false}
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
                totalPrice: getUpdatedQuoteTotal()
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
            </div>
          </>
        )}
      </div>
    </>
  );
};
