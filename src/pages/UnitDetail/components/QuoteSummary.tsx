
import { ReservationSummary } from "@/components/unit-detail/ReservationSummary";
import { Activity, ThemedPackage } from "@/types";

interface QuoteSummaryProps {
  quote: any;
  isAvailable: boolean;
  isProcessingPayment: boolean;
  onNewQuote: () => void;
  onConfirmReservation: () => void;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  getUpdatedQuoteTotal: () => number;
  startDate?: Date;
  endDate?: Date;
  guests: number;
  requiredDomos: number;
}

export const QuoteSummary = ({
  quote,
  isAvailable,
  isProcessingPayment,
  onNewQuote,
  onConfirmReservation,
  selectedActivities,
  selectedPackages,
  getUpdatedQuoteTotal,
  startDate,
  endDate,
  guests,
  requiredDomos
}: QuoteSummaryProps) => {
  return (
    <>
      <ReservationSummary
        quote={{
          ...quote,
          totalPrice: getUpdatedQuoteTotal(),
          requiredDomos: requiredDomos
        }}
        isAvailable={isAvailable}
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
