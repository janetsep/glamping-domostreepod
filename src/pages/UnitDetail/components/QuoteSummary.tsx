
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
  // Ya no necesitamos generar manualmente la distribución de domos,
  // ahora viene directamente del cálculo de la cotización
  const domoDistribution = quote?.domoDistribution || [];
  const pricePerDomo = quote ? Math.round(quote.basePrice / requiredDomos) : 0;

  return (
    <>
      <ReservationSummary
        quote={{
          ...quote,
          domoDistribution: domoDistribution
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
        <p>Huéspedes totales: {guests}</p>
        <p>Domos necesarios: {requiredDomos}</p>
      </div>
    </>
  );
};
