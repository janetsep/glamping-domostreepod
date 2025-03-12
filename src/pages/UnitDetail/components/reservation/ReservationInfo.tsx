
import { Activity, ThemedPackage } from "@/types";
import { ReservationSummary } from "@/components/unit-detail/ReservationSummary";

interface ReservationInfoProps {
  quote: any;
  isAvailable: boolean | null;
  isProcessingPayment: boolean;
  onNewQuote: () => void;
  onConfirmReservation: () => void;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  startDate?: Date;
  endDate?: Date;
  guests: number;
  requiredDomos: number;
  getUpdatedQuoteTotal: () => number;
}

export const ReservationInfo = ({
  quote,
  isAvailable,
  isProcessingPayment,
  onNewQuote,
  onConfirmReservation,
  selectedActivities,
  selectedPackages,
  startDate,
  endDate,
  guests,
  requiredDomos,
  getUpdatedQuoteTotal
}: ReservationInfoProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};
