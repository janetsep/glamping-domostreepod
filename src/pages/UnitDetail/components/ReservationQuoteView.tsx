
import { ReservationSummary } from "@/components/unit-detail/ReservationSummary";
import { Activity, ThemedPackage } from "@/types";

interface ReservationQuoteViewProps {
  quote: any;
  isAvailable: boolean;
  onNewQuote: () => void;
  onConfirmReservation: () => void;
  isProcessingPayment: boolean;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  getUpdatedQuoteTotal: () => number;
  requiredDomos: number;
  startDate?: Date;
  endDate?: Date;
  guests: number;
}

export const ReservationQuoteView = ({
  quote,
  isAvailable,
  onNewQuote,
  onConfirmReservation,
  isProcessingPayment,
  selectedActivities,
  selectedPackages,
  getUpdatedQuoteTotal,
  requiredDomos,
  startDate,
  endDate,
  guests
}: ReservationQuoteViewProps) => {
  return (
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
  );
};
