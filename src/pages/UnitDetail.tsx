
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReservations } from "@/hooks/useReservations";
import { supabase, type GlampingUnit } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { UnitInfo } from "@/components/unit-detail/UnitInfo";
import { DateSelector } from "@/components/unit-detail/DateSelector";
import { GuestSelector } from "@/components/unit-detail/GuestSelector";
import { ReservationSummary } from "@/components/unit-detail/ReservationSummary";
import { ActivitiesSelector } from "@/components/unit-detail/ActivitiesSelector";
import { ThemedPackagesSelector } from "@/components/unit-detail/ThemedPackagesSelector";
import { AvailabilityCalendar } from "@/components/unit-detail/AvailabilityCalendar";
import { Activity, ThemedPackage } from "@/types";
import { clearAllToasts } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { packageData } from "@/components/packages/packageData";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

  // Calculate updated quote total with selected extras
  const getUpdatedQuoteTotal = () => {
    if (!quote) return 0;
    return quote.totalPrice + activitiesTotal + packagesTotal;
  };

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
                  <div ref={confirmationRef} className="text-center p-8 space-y-4">
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
                    
                    {/* Available dates calendar button */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="mb-4 w-full flex items-center justify-center gap-2">
                          <CalendarRange className="h-4 w-4" />
                          Ver fechas disponibles
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="h-[80vh] sm:max-w-lg mx-auto rounded-t-xl">
                        <SheetHeader>
                          <SheetTitle>Fechas disponibles</SheetTitle>
                          <SheetDescription>
                            Revisa nuestra disponibilidad para planificar tu estadía
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-6">
                          <AvailabilityCalendar 
                            unitId={displayUnit.id} 
                            onSelectDate={(date) => {
                              setStartDate(date);
                              const checkoutDate = new Date(date);
                              checkoutDate.setDate(checkoutDate.getDate() + 2); // Default 2 night stay
                              setEndDate(checkoutDate);
                            }}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                    
                    <div className="space-y-4">
                      {!showQuote ? (
                        <>
                          <Tabs defaultValue="dates" value={reservationTab} onValueChange={setReservationTab}>
                            <TabsList className="grid grid-cols-3 mb-4">
                              <TabsTrigger value="dates">Fechas y huéspedes</TabsTrigger>
                              <TabsTrigger value="activities">Actividades</TabsTrigger>
                              <TabsTrigger value="packages">Paquetes</TabsTrigger>
                            </TabsList>
                            <TabsContent value="dates" className="space-y-4">
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
                              
                              {isAvailable !== null && (
                                <div className={`p-3 rounded-md mt-4 text-sm font-medium flex items-center gap-2 ${
                                  isAvailable ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                  {isAvailable ? (
                                    <>
                                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                      ¡Fechas disponibles! Puedes continuar con tu reserva.
                                    </>
                                  ) : (
                                    <>
                                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                      Fechas no disponibles. Por favor, selecciona otras fechas.
                                    </>
                                  )}
                                </div>
                              )}
                            </TabsContent>
                            
                            <TabsContent value="activities">
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Selecciona actividades</h3>
                                <p className="text-sm text-muted-foreground">
                                  Añade experiencias a tu estadía para hacerla más especial
                                </p>
                              </div>
                              <ActivitiesSelector 
                                selectedActivities={selectedActivities} 
                                onActivityToggle={handleActivityToggle} 
                              />
                              {selectedActivities.length > 0 && (
                                <div className="mt-4 pt-2 border-t">
                                  <div className="flex justify-between font-medium">
                                    <span>Total actividades:</span>
                                    <span>${activitiesTotal.toLocaleString()}</span>
                                  </div>
                                </div>
                              )}
                            </TabsContent>
                            
                            <TabsContent value="packages">
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Paquetes temáticos</h3>
                                <p className="text-sm text-muted-foreground">
                                  Personaliza tu experiencia con nuestros paquetes exclusivos
                                </p>
                              </div>
                              <ThemedPackagesSelector 
                                selectedPackages={selectedPackages} 
                                onPackageToggle={handlePackageToggle} 
                              />
                              {selectedPackages.length > 0 && (
                                <div className="mt-4 pt-2 border-t">
                                  <div className="flex justify-between font-medium">
                                    <span>Total paquetes:</span>
                                    <span>${packagesTotal.toLocaleString()}</span>
                                  </div>
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>

                          <div className="mt-8 text-sm text-gray-600 p-3 bg-amber-50 border border-amber-100 rounded">
                            <p className="font-medium text-amber-800 mb-1">Política de reserva</p>
                            <p>Pago total por adelantado para confirmar tu reserva. Check-in desde las 15:00, check-out hasta las 12:00.</p>
                          </div>

                          <Button 
                            className="w-full mt-2" 
                            size="lg"
                            onClick={handleReservation}
                            disabled={!startDate || !endDate || isAvailable === false}
                          >
                            {isAvailable === true ? 'Cotizar estadía' : 'Verificar disponibilidad'}
                          </Button>
                          
                          {(selectedActivities.length > 0 || selectedPackages.length > 0) && (
                            <div className="text-sm text-center mt-2 text-primary">
                              Has seleccionado {selectedActivities.length} actividades y {selectedPackages.length} paquetes.
                            </div>
                          )}
                        </>
                      ) : quote && (
                        <>
                          <ReservationSummary
                            quote={{
                              ...quote,
                              totalPrice: getUpdatedQuoteTotal()
                            }}
                            isAvailable={isAvailable || false}
                            isLoading={isProcessingPayment}
                            onReserve={handleNewQuote}
                            onConfirm={handleConfirmReservation}
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
