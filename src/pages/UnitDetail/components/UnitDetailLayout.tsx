
import { GlampingUnit } from "@/lib/supabase";
import { UnitHeader } from "../UnitHeader";
import { UnitContent } from "../UnitContent";
import { ReservationPanel } from "../ReservationPanel";
import { ReservationConfirmation } from "../ReservationConfirmation";
import { UnitDetailState } from "../hooks/useUnitDetailState";
import { Activity, ThemedPackage } from "@/types";

interface UnitDetailLayoutProps {
  state: UnitDetailState;
  displayUnit: GlampingUnit;
  navigate: (path: string) => void;
  handleActivityToggle: (activity: Activity) => void;
  handlePackageToggle: (pkg: ThemedPackage) => void;
  handleReservation: () => Promise<void>;
  handleNewQuote: () => void;
  handleConfirmReservation: () => Promise<void>;
  getUpdatedQuoteTotal: () => number;
}

export const UnitDetailLayout = ({
  state,
  displayUnit,
  navigate,
  handleActivityToggle,
  handlePackageToggle,
  handleReservation,
  handleNewQuote,
  handleConfirmReservation,
  getUpdatedQuoteTotal
}: UnitDetailLayoutProps) => {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4">
        <UnitHeader navigate={navigate} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UnitContent unit={displayUnit} />

          <div className="bg-secondary/20 p-6 rounded-lg shadow-sm">
            {state.isReservationConfirmed ? (
              <ReservationConfirmation 
                ref={state.confirmationRef}
                startDate={state.startDate}
                endDate={state.endDate}
                guests={state.guests}
                quote={state.quote}
                paymentDetails={state.paymentDetails}
                onNewQuote={handleNewQuote}
                reservationId={state.confirmedReservationId}
              />
            ) : (
              <ReservationPanel
                displayUnit={displayUnit}
                startDate={state.startDate}
                endDate={state.endDate}
                setStartDate={state.setStartDate}
                setEndDate={state.setEndDate}
                guests={state.guests}
                setGuests={state.setGuests}
                setAdults={state.setAdults}
                setChildren={state.setChildren}
                requiredDomos={state.requiredDomos}
                isAvailable={state.isAvailable}
                showQuote={state.showQuote}
                quote={state.quote}
                onReservation={handleReservation}
                onNewQuote={handleNewQuote}
                onConfirmReservation={handleConfirmReservation}
                isProcessingPayment={state.isProcessingPayment}
                selectedActivities={state.selectedActivities}
                selectedPackages={state.selectedPackages}
                onActivityToggle={handleActivityToggle}
                onPackageToggle={handlePackageToggle}
                activitiesTotal={state.activitiesTotal}
                packagesTotal={state.packagesTotal}
                getUpdatedQuoteTotal={getUpdatedQuoteTotal}
                reservationTab={state.reservationTab}
                setReservationTab={state.setReservationTab}
                isPartialAvailability={state.isPartialAvailability}
                availableDomos={state.availableDomos}
                alternativeDates={state.alternativeDates}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
