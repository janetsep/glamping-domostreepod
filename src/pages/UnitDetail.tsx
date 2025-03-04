
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
import { clearAllToasts } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { packageData } from "@/components/packages/packageData";

const UnitDetail = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [guests, setGuests] = useState<number>(1);
  const { checkAvailability, calculateQuote, createReservation, fetchGlampingUnits, redirectToWebpay } = useReservations();
  const { toast } = useToast();
  const [quote, setQuote] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [showQuote, setShowQuote] = useState(false);
  const [isReservationConfirmed, setIsReservationConfirmed] = useState(false);
  const [fallbackUnit, setFallbackUnit] = useState<GlampingUnit | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Use packageData as fallback when database fails
  useEffect(() => {
    if (unitId) {
      const packageItem = packageData.find(pkg => pkg.id === unitId);
      if (packageItem) {
        const packageUnit: GlampingUnit = {
          id: packageItem.id,
          name: packageItem.title,
          description: packageItem.detailedDescription,
          max_guests: 2,
          prices: {
            base_price: packageItem.price
          },
          image_url: packageItem.image,
        };
        setFallbackUnit(packageUnit);
      }
    }
  }, [unitId]);

  // Intentar obtener la unidad por ID
  const { data: unit, isError } = useQuery<GlampingUnit | null>({
    queryKey: ["unit", unitId],
    queryFn: async () => {
      try {
        console.log("Consultando unidad con ID:", unitId);
        
        if (!unitId) {
          console.error("ID de unidad no proporcionado");
          return null;
        }
        
        const { data, error } = await supabase
          .from("glamping_units")
          .select("*")
          .eq("id", unitId)
          .single();
        
        if (error) {
          console.error("Error al obtener unidad:", error);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error("Error en la consulta:", error);
        return null;
      }
    },
    enabled: !!unitId,
  });

  // Si no se encuentra por ID, cargar la primera unidad disponible
  useEffect(() => {
    const loadFallbackUnit = async () => {
      if (isError || (!unit && unitId && !fallbackUnit)) {
        console.log("Cargando unidad alternativa...");
        const units = await fetchGlampingUnits();
        if (units && units.length > 0) {
          console.log("Unidad alternativa encontrada:", units[0]);
          setFallbackUnit(units[0]);
        }
      }
    };

    loadFallbackUnit();
  }, [unitId, unit, isError, fetchGlampingUnits, fallbackUnit]);

  // Usar la unidad directa o la alternativa
  const displayUnit = unit || fallbackUnit;

  const checkAvailabilityAndQuote = async () => {
    if (!startDate || !endDate || !displayUnit) return;

    const available = await checkAvailability(displayUnit.id, startDate, endDate);
    setIsAvailable(available);

    if (available) {
      const quoteDetails = calculateQuote(
        displayUnit.prices,
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
    setPaymentDetails(null);
  };

  const handleConfirmReservation = async () => {
    if (!displayUnit || !startDate || !endDate || !quote) return;

    try {
      setIsProcessingPayment(true);
      
      // Limpiar todos los mensajes antes de iniciar el proceso
      clearAllToasts();
      sonnerToast.dismiss();
      
      const reservation = await createReservation(
        displayUnit.id,
        startDate,
        endDate,
        guests,
        quote.totalPrice,
        'webpay'
      );

      if (reservation) {
        // Iniciar el proceso de pago sin esperar respuesta (para evitar errores de timeout)
        redirectToWebpay(reservation.id, quote.totalPrice);
        // No hacemos nada después de la redirección, ya que el usuario será llevado a WebPay
      }
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      // No mostramos toast de error, ya que el usuario podría ser redirigido de todas formas
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Mostrar un mensaje de carga mientras obtenemos la información de la unidad
  if (!displayUnit) {
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
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2" />
          Volver a Domos
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayUnit ? (
            <>
              <UnitInfo unit={displayUnit} />

              <div className="bg-secondary/20 p-6 rounded-lg shadow-sm">
                {isReservationConfirmed ? (
                  <div className="text-center p-8 space-y-4">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-display font-bold">¡Reserva confirmada!</h2>
                    <p>
                      Gracias por tu reserva en Domos TreePod. Hemos enviado los detalles a tu correo electrónico.
                    </p>
                    <div className="text-sm text-muted-foreground mt-4 space-y-2">
                      <p>Fechas reservadas:</p>
                      <p>Entrada: {startDate?.toLocaleDateString()}</p>
                      <p>Salida: {endDate?.toLocaleDateString()}</p>
                      <p>Huéspedes: {guests}</p>
                      <p className="font-semibold mt-2">Total: ${quote?.totalPrice.toLocaleString()}</p>
                      
                      {paymentDetails && (
                        <div className="mt-4 pt-4 border-t text-left">
                          <p className="font-semibold mb-2">Detalles del pago:</p>
                          <p>Método: WebPay Plus</p>
                          <p>Tarjeta: {paymentDetails.card_detail?.card_number}</p>
                          <p>Código de autorización: {paymentDetails.authorization_code}</p>
                          <p>Estado: {paymentDetails.status}</p>
                        </div>
                      )}
                    </div>
                    <Button className="mt-6" onClick={handleNewQuote}>
                      Hacer nueva reserva
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-display font-bold mb-6">
                      Reserva tu experiencia TreePod
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
                            maxGuests={displayUnit.max_guests}
                            guests={guests}
                            onGuestsChange={setGuests}
                          />

                          <div className="mt-8 text-sm text-gray-600 p-3 bg-amber-50 border border-amber-100 rounded">
                            <p className="font-medium text-amber-800 mb-1">Política de reserva</p>
                            <p>Pago total por adelantado para confirmar tu reserva. Check-in desde las 15:00, check-out hasta las 12:00.</p>
                          </div>

                          <Button 
                            className="w-full mt-2" 
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
                            isLoading={isProcessingPayment}
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
            </>
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Cargando información del domo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitDetail;
