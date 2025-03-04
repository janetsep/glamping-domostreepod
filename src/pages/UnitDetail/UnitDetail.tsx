
import { useParams, useNavigate } from "react-router-dom";
import { useUnitDetailState } from "./hooks/useUnitDetailState";
import { useReservationActions } from "./hooks/useReservationActions";
import { useEffect } from "react";

// Import our components
import { UnitHeader } from "./UnitHeader";
import { UnitContent } from "./UnitContent";
import { ReservationPanel } from "./ReservationPanel";
import { ReservationConfirmation } from "./ReservationConfirmation";

const UnitDetail = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  
  // Use our custom hooks
  const state = useUnitDetailState(unitId);
  const {
    handleActivityToggle,
    handlePackageToggle,
    checkDatesAvailability,
    handleReservation,
    handleNewQuote,
    handleConfirmReservation,
    getUpdatedQuoteTotal
  } = useReservationActions(state);

  // Verificar disponibilidad automáticamente cuando se seleccionan fechas
  useEffect(() => {
    checkDatesAvailability();
  }, [state.startDate, state.endDate, state.displayUnit]);

  // Resetear el estado de verificación cuando cambien las fechas
  useEffect(() => {
    state.setCheckedAvailability(false);
    state.setShowQuote(false);
    state.setQuote(null);
  }, [state.startDate, state.endDate]);

  // Mostrar un mensaje de carga mientras obtenemos la información de la unidad
  if (!state.displayUnit) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="container mx-auto px-4 text-center">
          <p>Cargando información del domo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4">
        <UnitHeader navigate={navigate} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {state.displayUnit && (
            <>
              <UnitContent unit={state.displayUnit} />

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
                  />
                ) : (
                  <ReservationPanel
                    displayUnit={state.displayUnit}
                    startDate={state.startDate}
                    endDate={state.endDate}
                    setStartDate={state.setStartDate}
                    setEndDate={state.setEndDate}
                    guests={state.guests}
                    setGuests={state.setGuests}
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
