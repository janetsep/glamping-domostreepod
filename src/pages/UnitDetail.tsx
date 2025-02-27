
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
  const { checkAvailability, calculateQuote } = useReservations();
  const { toast } = useToast();
  const [quote, setQuote] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

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
    } else {
      setQuote(null);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      checkAvailabilityAndQuote();
    }
  }, [startDate, endDate, guests]);

  const handleReservation = async () => {
    if (!startDate || !endDate || !quote) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona las fechas de entrada y salida",
      });
      return;
    }

    if (!isAvailable) {
      toast({
        variant: "destructive",
        title: "No disponible",
        description: "Lo sentimos, las fechas seleccionadas no están disponibles.",
      });
      return;
    }

    toast({
      title: "Cotización lista",
      description: "Las fechas están disponibles. Puedes proceder con la reserva.",
    });
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
            <h2 className="text-2xl font-display font-bold mb-6">
              Cotiza tu estadía
            </h2>
            <div className="space-y-4">
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

              {startDate && endDate && quote && (
                <ReservationSummary
                  quote={quote}
                  isAvailable={isAvailable || false}
                  isLoading={false}
                  onReserve={handleReservation}
                  buttonText="Verificar disponibilidad"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitDetail;
