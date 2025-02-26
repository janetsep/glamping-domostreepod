import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { useReservations } from "@/hooks/useReservations";
import { supabase, type GlampingUnit } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const UnitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [guests, setGuests] = useState<number>(1);
  const { createReservation, isLoading, checkAvailability, calculateQuote } = useReservations();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  const [quote, setQuote] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  if (!unit) return null;

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

  // Modificar el handleReservation para usar el precio de la cotización
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

    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes iniciar sesión para hacer una reserva",
      });
      return;
    }

    const reservation = await createReservation(
      unit.id,
      startDate,
      endDate,
      guests,
      quote.totalPrice
    );

    if (reservation) {
      navigate("/reservations");
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2" />
          Volver
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen y detalles */}
          <div>
            <img
              src={unit.image_url || "/placeholder.svg"}
              alt={unit.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="mt-6">
              <h1 className="text-3xl font-display font-bold text-primary mb-4">
                {unit.name}
              </h1>
              <p className="text-gray-600 mb-4">{unit.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>Hasta {unit.max_guests} personas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de reserva */}
          <div className="bg-secondary/20 p-6 rounded-lg">
            <h2 className="text-2xl font-display font-bold mb-6">
              Reserva tu estadía
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Fecha de entrada */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !startDate && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP", { locale: es })
                      ) : (
                        <span>Fecha de entrada</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) =>
                        date < new Date() || (endDate ? date >= endDate : false)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* Fecha de salida */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !endDate && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "PPP", { locale: es })
                      ) : (
                        <span>Fecha de salida</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) =>
                        !startDate || date <= startDate || date <= new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Número de huéspedes */}
              <Select
                value={guests.toString()}
                onValueChange={(value) => setGuests(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Número de huéspedes" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: unit.max_guests },
                    (_, i) => i + 1
                  ).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "huésped" : "huéspedes"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Resumen y precio */}
              {startDate && endDate && quote && (
                <div className="border-t pt-4 mt-4 space-y-3">
                  {quote.breakdown.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.description}</span>
                      <span>${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="text-lg font-semibold flex justify-between pt-2 border-t">
                    <span>Total</span>
                    <span>${quote.totalPrice.toLocaleString()}</span>
                  </div>
                  {isAvailable ? (
                    <p className="text-green-600 text-sm">✓ Fechas disponibles</p>
                  ) : (
                    <p className="text-red-600 text-sm">✗ Fechas no disponibles</p>
                  )}
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                disabled={!startDate || !endDate || isLoading || !isAvailable}
                onClick={handleReservation}
              >
                {isAvailable ? "Reservar ahora" : "Fechas no disponibles"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitDetail;
