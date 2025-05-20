
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
  const controller = useUnitDetailController();

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4">
        <UnitHeader navigate={navigate} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {controller.displayUnit && (
            <>
              <UnitContent unit={controller.displayUnit} />

              <div className="bg-secondary/20 p-6 rounded-lg shadow-sm">
                {controller.isReservationConfirmed ? (
                  <ReservationConfirmation 
                    ref={controller.confirmationRef}
                    startDate={controller.startDate}
                    endDate={controller.endDate}
                    guests={controller.guests}
                    quote={controller.quote}
                    paymentDetails={controller.paymentDetails}
                    onNewQuote={controller.handleNewQuote}
                    reservationId={controller.confirmedReservationId}
                  />
                ) : (
                  <ReservationPanel
                    displayUnit={controller.displayUnit}
                    startDate={controller.startDate}
                    endDate={controller.endDate}
                    setStartDate={controller.setStartDate}
                    setEndDate={controller.setEndDate}
                    guests={controller.guests}
                    setGuests={controller.setGuests}
                    requiredDomos={controller.requiredDomos}
                    isAvailable={controller.isAvailable}
                    showQuote={controller.showQuote}
                    quote={controller.quote}
                    onReservation={controller.handleReservation}
                    onNewQuote={controller.handleNewQuote}
                    onConfirmReservation={controller.handleConfirmReservation}
                    isProcessingPayment={controller.isProcessingPayment}
                    selectedActivities={controller.selectedActivities}
                    selectedPackages={controller.selectedPackages}
                    onActivityToggle={controller.handleActivityToggle}
                    onPackageToggle={controller.handlePackageToggle}
                    activitiesTotal={controller.activitiesTotal}
                    packagesTotal={controller.packagesTotal}
                    getUpdatedQuoteTotal={controller.getUpdatedQuoteTotal}
                    reservationTab={controller.reservationTab}
                    setReservationTab={controller.setReservationTab}
                    isPartialAvailability={controller.isPartialAvailability}
                    availableDomos={controller.availableDomos}
                    alternativeDates={controller.alternativeDates}
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
