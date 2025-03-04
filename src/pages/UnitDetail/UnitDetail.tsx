
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReservations } from "@/hooks/reservations";
import { supabase, type GlampingUnit } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { packageData } from "@/components/packages/packageData";
import { clearAllToasts } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Activity, ThemedPackage } from "@/types";

// Import our newly created components
import { UnitHeader } from "./UnitHeader";
import { UnitContent } from "./UnitContent";
import { ReservationPanel } from "./ReservationPanel";
import { ReservationConfirmation } from "./ReservationConfirmation";

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
  const [checkedAvailability, setCheckedAvailability] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<ThemedPackage[]>([]);
  const [activitiesTotal, setActivitiesTotal] = useState(0);
  const [packagesTotal, setPackagesTotal] = useState(0);
  const [reservationTab, setReservationTab] = useState("dates");
  const confirmationRef = useRef<HTMLDivElement>(null);

  // Calculate totals for activities and packages
  useEffect(() => {
    let actTotal = 0;
    let pkgTotal = 0;

    selectedActivities.forEach((activity) => {
      actTotal += activity.price;
    });

    selectedPackages.forEach((pkg) => {
      pkgTotal += pkg.price;
    });

    setActivitiesTotal(actTotal);
    setPackagesTotal(pkgTotal);
  }, [selectedActivities, selectedPackages]);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to confirmation when reservation is confirmed
  useEffect(() => {
    if (isReservationConfirmed && confirmationRef.current) {
      confirmationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isReservationConfirmed]);

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

  // Handle activity toggle
  const handleActivityToggle = (activity: Activity) => {
    setSelectedActivities((prev) => {
      const isSelected = prev.some((a) => a.id === activity.id);
      if (isSelected) {
        return prev.filter((a) => a.id !== activity.id);
      } else {
        return [...prev, activity];
      }
    });
  };

  // Handle package toggle
  const handlePackageToggle = (pkg: ThemedPackage) => {
    setSelectedPackages((prev) => {
      const isSelected = prev.some((p) => p.id === pkg.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== pkg.id);
      } else {
        return [...prev, pkg];
      }
    });
  };

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

  // Verificar disponibilidad automáticamente cuando se seleccionan fechas
  useEffect(() => {
    const checkDatesAvailability = async () => {
      if (startDate && endDate && displayUnit && !checkedAvailability) {
        const available = await checkAvailability(displayUnit.id, startDate, endDate);
        setIsAvailable(available);
        setCheckedAvailability(true);
        
        if (available) {
          toast({
            title: "Fechas disponibles",
            description: "Las fechas seleccionadas están disponibles para reserva.",
            variant: "default",
          });
        } else {
          toast({
            variant: "destructive",
            title: "No disponible",
            description: "Las fechas seleccionadas no están disponibles. Por favor, elige otras fechas.",
          });
        }
      }
    };
    
    checkDatesAvailability();
  }, [startDate, endDate, displayUnit, checkAvailability, toast, checkedAvailability]);

  // Resetear el estado de verificación cuando cambien las fechas
  useEffect(() => {
    setCheckedAvailability(false);
    setShowQuote(false);
    setQuote(null);
  }, [startDate, endDate]);

  const checkAvailabilityAndQuote = async () => {
    if (!startDate || !endDate || !displayUnit) return;

    const available = await checkAvailability(displayUnit.id, startDate, endDate);
    setIsAvailable(available);

    if (available) {
      let quoteDetails = calculateQuote(
        displayUnit.prices,
        startDate,
        endDate,
        guests
      );
      
      // Add activities and packages to the quote
      if (selectedActivities.length > 0 || selectedPackages.length > 0) {
        // Add activities and packages to the breakdown
        const totalWithExtras = quoteDetails.totalPrice + activitiesTotal + packagesTotal;
        
        quoteDetails = {
          ...quoteDetails,
          totalPrice: totalWithExtras
        };
      }
      
      setQuote(quoteDetails);
      setShowQuote(true);
      setReservationTab("summary");
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
    setCheckedAvailability(false);
    setSelectedActivities([]);
    setSelectedPackages([]);
    setReservationTab("dates");
  };

  const handleConfirmReservation = async () => {
    if (!displayUnit || !startDate || !endDate || !quote) return;

    try {
      setIsProcessingPayment(true);
      
      // Limpiar todos los mensajes antes de iniciar el proceso
      clearAllToasts();
      sonnerToast.dismiss();
      
      // Get activity and package IDs for storage
      const activityIds = selectedActivities.map(a => a.id);
      const packageIds = selectedPackages.map(p => p.id);
      
      const reservation = await createReservation(
        displayUnit.id,
        startDate,
        endDate,
        guests,
        quote.totalPrice,
        'webpay',
        activityIds,
        packageIds
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

  // Calculate updated quote total with selected extras
  const getUpdatedQuoteTotal = () => {
    if (!quote) return 0;
    return quote.totalPrice + activitiesTotal + packagesTotal;
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
        <UnitHeader navigate={navigate} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayUnit && (
            <>
              <UnitContent unit={displayUnit} />

              <div className="bg-secondary/20 p-6 rounded-lg shadow-sm">
                {isReservationConfirmed ? (
                  <ReservationConfirmation 
                    ref={confirmationRef}
                    startDate={startDate}
                    endDate={endDate}
                    guests={guests}
                    quote={quote}
                    paymentDetails={paymentDetails}
                    onNewQuote={handleNewQuote}
                  />
                ) : (
                  <ReservationPanel
                    displayUnit={displayUnit}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    guests={guests}
                    setGuests={setGuests}
                    isAvailable={isAvailable}
                    showQuote={showQuote}
                    quote={quote}
                    onReservation={handleReservation}
                    onNewQuote={handleNewQuote}
                    onConfirmReservation={handleConfirmReservation}
                    isProcessingPayment={isProcessingPayment}
                    selectedActivities={selectedActivities}
                    selectedPackages={selectedPackages}
                    onActivityToggle={handleActivityToggle}
                    onPackageToggle={handlePackageToggle}
                    activitiesTotal={activitiesTotal}
                    packagesTotal={packagesTotal}
                    getUpdatedQuoteTotal={getUpdatedQuoteTotal}
                    reservationTab={reservationTab}
                    setReservationTab={setReservationTab}
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
