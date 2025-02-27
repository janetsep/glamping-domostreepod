
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReservations } from "@/hooks/useReservations";
import { supabase, type GlampingUnit } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { UnitInfo } from "@/components/unit-detail/UnitInfo";
import { DateSelector } from "@/components/unit-detail/DateSelector";
import { GuestSelector } from "@/components/unit-detail/GuestSelector";
import { ReservationSummary } from "@/components/unit-detail/ReservationSummary";

const UnitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [guests, setGuests] = useState<number>(1);
  const { checkAvailability, calculateQuote, createReservation } = useReservations();
  const { toast } = useToast();
  const [quote, setQuote] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [showQuote, setShowQuote] = useState(false);
  const [isReservationConfirmed, setIsReservationConfirmed] = useState(false);

  const { data: unit } = useQuery<GlampingUnit>({
    queryKey: ["unit", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("glamping_units")
        .select("*")
        .eq("id", id)
        .single();
      return data;
    },
  });

  const checkAvailabilityAndQuote = async () => {
    if (!startDate || !endDate || !unit) return;

    const available = await checkAvailability(unit.id, startDate, endDate);
    setIsAvailable(available);

    if (available) {
      const quoteDetails = calculateQuote(
        unit.price_per_night,
        startDate,
        endDate,
        guests
      );
      setQuote(quoteDetails);
      setShowQuote(true);
    } else {
      setQuote(null);
      setShowQuote(false);
      toast({
        variant: "destructive",
        title: "No disponible",
        description: "Las fechas seleccionadas no están disponibles.",
      });
    }
  };

  useEffect(() => {
    // Resetear la cotización cuando cambien las fechas o el número de huéspedes
    setShowQuote(false);
    setQuote(null);
  }, [startDate, endDate, guests]);

  const handleReservation = async () => {
    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona las fechas de entrada y salida",
      });
      return;
    }

    await checkAvailabilityAndQuote();
  };

  const handleNewQuote = () => {
    setShowQuote(false);
    setStartDate(undefined);
    setEndDate(undefined);
    setGuests(1);
    setQuote(null);
    setIsReservationConfirmed(false);
  };

  const handleConfirmReservation = async () => {
    if (!unit || !startDate || !endDate || !quote) return;

    try {
      const reservation = await createReservation(
        unit.id,
        startDate,
        endDate,
        guests,
        quote.totalPrice
      );

      if (reservation) {
        setIsReservationConfirmed(true);
        toast({
          title: "¡Reserva confirmada!",
          description: "Hemos registrado tu reserva correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo confirmar la reserva. Por favor, intenta de nuevo.",
      });
    }
  };

  if (!unit) return null;

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4">
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2" />
          Volver
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UnitInfo unit={unit} />

          <div className="bg-secondary/20 p-6 rounded-lg">
            {isReservationConfirmed ? (
              <div className="text-center p-8 space-y-4">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-display font-bold">¡Reserva confirmada!</h2>
                <p>
                  Gracias por tu reserva. Hemos enviado los detalles a tu correo electrónico.
                </p>
                <div className="text-sm text-muted-foreground mt-4">
                  <p>Fechas reservadas:</p>
                  <p>Entrada: {startDate?.toLocaleDateString()}</p>
                  <p>Salida: {endDate?.toLocaleDateString()}</p>
                  <p>Huéspedes: {guests}</p>
                  <p className="font-semibold mt-2">Total: ${quote?.totalPrice.toLocaleString()}</p>
                </div>
                <Button className="mt-6" onClick={handleNewQuote}>
                  Hacer nueva reserva
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-display font-bold mb-6">
                  Cotiza tu estadía
                </h2>
                <div className="space-y-4">
                  {!showQuote ? (
                    <>
                      <DateSelector
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                      />

                      <GuestSelector
                        maxGuests={unit.max_guests}
                        guests={guests}
                        onGuestsChange={setGuests}
                      />

                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleReservation}
                        disabled={!startDate || !endDate}
                      >
                        Cotizar estadía
                      </Button>
                    </>
                  ) : quote && (
                    <>
                      <ReservationSummary
                        quote={quote}
                        isAvailable={isAvailable || false}
                        isLoading={false}
                        onReserve={handleNewQuote}
                        onConfirm={handleConfirmReservation}
                        buttonText="Aceptar cotización"
                      />
                      <div className="text-sm text-muted-foreground mt-4">
                        <p>Fechas seleccionadas:</p>
                        <p>Entrada: {startDate?.toLocaleDateString()}</p>
                        <p>Salida: {endDate?.toLocaleDateString()}</p>
                        <p>Huéspedes: {guests}</p>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitDetail;
