
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

// Import our components
import { UnitHeader } from "./UnitHeader";
import { UnitContent } from "./UnitContent";
import { ReservationPanel } from "./ReservationPanel";
import { ReservationConfirmation } from "./ReservationConfirmation";
import { useUnitDetailState } from "./hooks/useUnitDetailState";
import { usePaymentStatusHandler } from "./hooks/usePaymentStatusHandler";

const UnitDetail = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Use our state hook
  const state = useUnitDetailState(unitId);
  
  // Handle payment status
  const { processPaymentStatus } = usePaymentStatusHandler(state, searchParams);
  
  // Process payment status when component mounts or searchParams change
  useEffect(() => {
    processPaymentStatus();
  }, [processPaymentStatus]);

  // Scroll to reservation panel on load
  useEffect(() => {
    if (state.displayUnit) {
      // Delay to ensure content is loaded
      setTimeout(() => {
        const reservationPanel = document.querySelector('[data-testid="reservation-panel"]');
        if (reservationPanel) {
          const headerOffset = 80;
          const elementPosition = reservationPanel.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  }, [state.displayUnit]);

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto container-padding">
        <UnitHeader navigate={navigate} />

        {/* Layout móvil optimizado */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-0">
          {state.displayUnit && (
            <>
              {/* Contenido scrollable del domo - 3/5 del ancho */}
              <div className="lg:col-span-3">
                <UnitContent 
                  unit={state.displayUnit} 
                  currentStep={state.getCurrentStep()}
                  showQuote={state.showQuote}
                  isProcessingPayment={state.isProcessingPayment}
                  isReservationConfirmed={state.isReservationConfirmed}
                />
              </div>

              {/* Panel de reserva fijo - 2/5 del ancho, optimizado para móvil */}
              <div className="order-first lg:order-last lg:col-span-2">
                {state.isReservationConfirmed ? (
                  <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-white lg:border-l border-gray-200 p-4 lg:p-5 mb-6 lg:mb-0 rounded-lg lg:rounded-none shadow-lg lg:shadow-none">
                    <ReservationConfirmation 
                      ref={state.confirmationRef}
                      startDate={state.startDate}
                      endDate={state.endDate}
                      guests={state.guests}
                      quote={state.quote}
                      paymentDetails={state.paymentDetails}
                      onNewQuote={() => {
                        state.setShowQuote(false);
                        state.setIsReservationConfirmed(false);
                      }}
                      reservationId={state.confirmedReservationId}
                    />
                  </div>
                ) : (
                  <ReservationPanel
                    displayUnit={state.displayUnit}
                    startDate={state.startDate}
                    endDate={state.endDate}
                    setStartDate={state.setStartDate}
                    setEndDate={state.setEndDate}
                    guests={state.guests}
                    setGuests={state.setGuests}
                    adults={state.adults}
                    children={state.children}
                    setAdults={state.setAdults}
                    setChildren={state.setChildren}
                    requiredDomos={state.requiredDomos}
                    selectedDomos={state.selectedDomos}
                    setSelectedDomos={state.setSelectedDomos}
                    isAvailable={state.isAvailable}
                    showQuote={state.showQuote}
                    quote={state.quote}
                    onReservation={state.generateQuote}
                    onNewQuote={() => {
                      state.setShowQuote(false);
                      state.setQuote(null);
                    }}
                    onConfirmReservation={state.confirmReservation}
                    isProcessingPayment={state.isProcessingPayment}
                    selectedActivities={state.selectedActivities}
                    selectedPackages={state.selectedPackages}
                    onActivityToggle={(activity) => {
                      const exists = state.selectedActivities.find(a => a.id === activity.id);
                      if (exists) {
                        state.setSelectedActivities(state.selectedActivities.filter(a => a.id !== activity.id));
                      } else {
                        state.setSelectedActivities([...state.selectedActivities, activity]);
                      }
                    }}
                    onPackageToggle={(pkg) => {
                      const exists = state.selectedPackages.find(p => p.id === pkg.id);
                      if (exists) {
                        state.setSelectedPackages(state.selectedPackages.filter(p => p.id !== pkg.id));
                      } else {
                        state.setSelectedPackages([...state.selectedPackages, pkg]);
                      }
                    }}
                    activitiesTotal={state.activitiesTotal}
                    packagesTotal={state.packagesTotal}
                    getUpdatedQuoteTotal={() => {
                      if (!state.quote) return 0;
                      return state.quote.totalPrice + state.activitiesTotal + state.packagesTotal;
                    }}
                    reservationTab={state.reservationTab}
                    setReservationTab={state.setReservationTab}
                    isPartialAvailability={state.isPartialAvailability}
                    availableDomos={state.availableDomos}
                    alternativeDates={state.alternativeDates}
                    getCurrentStep={state.getCurrentStep}
                    isReservationConfirmed={state.isReservationConfirmed}
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
