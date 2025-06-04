
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

// Import our components
import { UnitHeader } from "./UnitHeader";
import { UnitContent } from "./UnitContent";
import { ReservationPanel } from "./ReservationPanel";
import { ReservationConfirmation } from "./ReservationConfirmation";
import { useUnitDetailController } from "./hooks/useUnitDetailController";

const UnitDetail = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Use our controller hook that combines all the functionality
  const controller = useUnitDetailController(unitId, searchParams);

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4">
        <UnitHeader navigate={navigate} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {controller.state.displayUnit && (
            <>
              <UnitContent 
                unit={controller.state.displayUnit} 
                currentStep={controller.state.getCurrentStep()}
                showQuote={controller.state.showQuote}
                isProcessingPayment={controller.state.isProcessingPayment}
                isReservationConfirmed={controller.state.isReservationConfirmed}
              />

              <div className="bg-secondary/20 p-6 rounded-lg shadow-sm">
                {controller.state.isReservationConfirmed ? (
                  <ReservationConfirmation 
                    ref={controller.state.confirmationRef}
                    startDate={controller.state.startDate}
                    endDate={controller.state.endDate}
                    guests={controller.state.guests}
                    quote={controller.state.quote}
                    paymentDetails={controller.state.paymentDetails}
                    onNewQuote={controller.actions.handleNewQuote}
                    reservationId={controller.state.confirmedReservationId}
                  />
                ) : (
                  <ReservationPanel
                    displayUnit={controller.state.displayUnit}
                    startDate={controller.state.startDate}
                    endDate={controller.state.endDate}
                    setStartDate={controller.state.setStartDate}
                    setEndDate={controller.state.setEndDate}
                    guests={controller.state.guests}
                    setGuests={controller.state.setGuests}
                    adults={controller.state.adults}
                    children={controller.state.children}
                    setAdults={controller.state.setAdults}
                    setChildren={controller.state.setChildren}
                    requiredDomos={controller.state.requiredDomos}
                    isAvailable={controller.state.isAvailable}
                    showQuote={controller.state.showQuote}
                    quote={controller.state.quote}
                    onReservation={controller.actions.handleReservation}
                    onNewQuote={controller.actions.handleNewQuote}
                    onConfirmReservation={controller.actions.handleConfirmReservation}
                    isProcessingPayment={controller.state.isProcessingPayment}
                    selectedActivities={controller.state.selectedActivities}
                    selectedPackages={controller.state.selectedPackages}
                    onActivityToggle={controller.actions.handleActivityToggle}
                    onPackageToggle={controller.actions.handlePackageToggle}
                    activitiesTotal={controller.state.activitiesTotal}
                    packagesTotal={controller.state.packagesTotal}
                    getUpdatedQuoteTotal={controller.actions.getUpdatedQuoteTotal}
                    reservationTab={controller.state.reservationTab}
                    setReservationTab={controller.state.setReservationTab}
                    isPartialAvailability={controller.state.isPartialAvailability}
                    availableDomos={controller.state.availableDomos}
                    alternativeDates={controller.state.alternativeDates}
                    getCurrentStep={controller.state.getCurrentStep}
                    isReservationConfirmed={controller.state.isReservationConfirmed}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitDetail;
