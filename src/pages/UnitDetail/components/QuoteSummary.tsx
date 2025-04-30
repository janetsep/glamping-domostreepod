
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
  // Distribuir huéspedes entre domos
  const generateDomoDistribution = () => {
    // Si solo hay un domo, todos los huéspedes van ahí
    if (requiredDomos === 1) {
      return [{ number: 1, guests: guests }];
    }

    // Si hay múltiples domos, distribuimos los huéspedes
    const distribution = [];
    let remainingGuests = guests;
    const maxGuestsPerDomo = 4;

    for (let i = 1; i <= requiredDomos; i++) {
      const domoGuests = Math.min(remainingGuests, maxGuestsPerDomo);
      distribution.push({ number: i, guests: domoGuests });
      remainingGuests -= domoGuests;
      
      if (remainingGuests <= 0) break;
    }

    return distribution;
  };

  const domoDistribution = generateDomoDistribution();
  const pricePerDomo = quote ? Math.round(quote.basePrice / requiredDomos) : 0;

  return (
    <>
      <ReservationSummary
        quote={{
          ...quote,
          totalPrice: quote.basePrice, // Precio base sin extras
          requiredDomos: requiredDomos,
          domoDistribution: domoDistribution,
          pricePerDomo: pricePerDomo
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
