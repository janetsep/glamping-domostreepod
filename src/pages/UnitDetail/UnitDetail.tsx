
import { useParams, useNavigate } from "react-router-dom";
import { useUnitDetailState } from "./hooks/useUnitDetailState";
import { useReservationActions } from "./hooks/useReservationActions";
import { useEffect } from "react";
import { PaymentSuccessHandler } from "./components/PaymentSuccessHandler";
import { AvailabilityWatcher } from "./components/AvailabilityWatcher";
import { UnitDetailLayout } from "./components/UnitDetailLayout";

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

  // Handle payment callbacks and watch availability using dedicated components
  return (
    <>
      <PaymentSuccessHandler state={state} />
      <AvailabilityWatcher state={state} checkDatesAvailability={checkDatesAvailability} />
      
      {/* Show loading message while getting unit information */}
      {!state.displayUnit ? (
        <div className="min-h-screen bg-white pt-24">
          <div className="container mx-auto px-4 text-center">
            <p>Cargando información del domo...</p>
          </div>
        </div>
      ) : (
        <UnitDetailLayout
          state={state}
          displayUnit={state.displayUnit}
          navigate={navigate}
          handleActivityToggle={handleActivityToggle}
          handlePackageToggle={handlePackageToggle}
          handleReservation={handleReservation}
          handleNewQuote={handleNewQuote}
          handleConfirmReservation={handleConfirmReservation}
          getUpdatedQuoteTotal={getUpdatedQuoteTotal}
        />
      )}
    </>
  );
};

export default UnitDetail;
