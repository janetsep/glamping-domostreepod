
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useUnitDetailState } from "./hooks/useUnitDetailState";
import { useReservationActions } from "./hooks/useReservationActions";
import { useEffect } from "react";

// Import our components
import { UnitHeader } from "./UnitHeader";
import { UnitContent } from "./UnitContent";
import { ReservationPanel } from "./ReservationPanel";
import { ReservationConfirmation } from "./ReservationConfirmation";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const UnitDetail = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
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

  // Handle payment success and reservation confirmation from URL
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const reservationId = searchParams.get('reservationId');
    
    if (paymentStatus === 'success' && reservationId) {
      // First check if we haven't already processed this reservation
      if (!state.isReservationConfirmed) {
        // Fetch reservation details
        const fetchReservationDetails = async () => {
          try {
            const { data: reservation, error } = await supabase
              .from('reservations')
              .select('*, payment_details')
              .eq('id', reservationId)
              .single();
            
            if (error) throw error;
            
            if (reservation) {
              // Set reservation details in state
              state.setIsReservationConfirmed(true);
              state.setConfirmedReservationId(reservationId);
              state.setPaymentDetails(reservation.payment_details);
              
              // Set dates
              if (reservation.check_in) {
                state.setStartDate(new Date(reservation.check_in));
              }
              
              if (reservation.check_out) {
                state.setEndDate(new Date(reservation.check_out));
              }
              
              state.setGuests(reservation.guests);
              
              // Create a quote object
              const quoteDays = Math.round(
                (new Date(reservation.check_out).getTime() - new Date(reservation.check_in).getTime()) / 
                (1000 * 60 * 60 * 24)
              );
              
              state.setQuote({
                nights: quoteDays,
                basePrice: reservation.total_price,
                totalPrice: reservation.total_price,
                selectedActivities: [],
                selectedPackages: []
              });
              
              toast({
                title: "Reserva confirmada",
                description: "Tu reserva ha sido confirmada exitosamente",
              });
            }
          } catch (error) {
            console.error("Error fetching reservation details:", error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "No se pudieron cargar los detalles de la reserva",
            });
          }
        };
        
        fetchReservationDetails();
      }
    } else if (paymentStatus === 'failed') {
      toast({
        variant: "destructive",
        title: "Pago no completado",
        description: "El pago no se completó correctamente. Por favor, intenta de nuevo.",
      });
    }
  }, [searchParams, state]);

  // Check availability automatically when dates are selected
  useEffect(() => {
    if (state.startDate && state.endDate) {
      checkDatesAvailability();
    }
  }, [state.startDate, state.endDate, state.displayUnit]);

  // Reset verification state when dates change
  useEffect(() => {
    if (state.startDate || state.endDate) {
      state.setCheckedAvailability(false);
      state.setShowQuote(false);
      state.setQuote(null);
    }
  }, [state.startDate, state.endDate]);

  // Show loading message while getting unit information
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
                    reservationId={state.confirmedReservationId}
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
