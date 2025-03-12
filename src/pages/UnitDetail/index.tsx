
import { useParams, useNavigate } from "react-router-dom";
import { useUnitDetailState } from "./hooks/useUnitDetailState";
import { useReservationActions } from "./hooks/useReservationActions";
import { UnitHeader } from "./UnitHeader";
import { UnitContent } from "./UnitContent";
import { ReservationPanel } from "./components/reservation/ReservationPanel";
import { ClientInformationForm } from "./ClientInformationForm";
import { ReservationConfirmation } from "./ReservationConfirmation";

export default function UnitDetail() {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const state = useUnitDetailState(unitId);
  const {
    handleReservation,
    handleNewQuote,
    handleConfirmReservation,
    handleActivityToggle,
    handlePackageToggle,
    getUpdatedQuoteTotal
  } = useReservationActions(state);

  if (!state.displayUnit) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UnitHeader navigate={navigate} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <UnitContent unit={state.displayUnit} />
        
        <div className="lg:col-span-1">
          {state.isReservationConfirmed ? (
            <div ref={state.confirmationRef}>
              <ReservationConfirmation
                reservationId={state.confirmedReservationId || ""}
              />
            </div>
          ) : state.showQuote && state.quote ? (
            <>
              <ReservationPanel
                displayUnit={state.displayUnit}
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
              
              <ClientInformationForm
                clientInformation={state.clientInformation}
                setClientInformation={state.setClientInformation}
                onSubmit={handleConfirmReservation}
              />
            </>
          ) : (
            <ReservationPanel
              displayUnit={state.displayUnit}
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
  );
}
