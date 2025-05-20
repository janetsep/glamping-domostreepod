
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { Activity, ThemedPackage } from "@/types";
import { useAvailabilityCheck } from "@/hooks/reservations/useAvailabilityCheck";
import { calculatePrice } from "@/hooks/reservations/usePricing"; // Corregido aquí
import { useReservationCreation } from "@/hooks/reservations/useReservationCreation";
import { usePaymentStatus } from "./usePaymentStatusHandler";
import { useQuoteBase } from "./useQuoteBase";

// Función auxiliar para calcular domos requeridos
const calculateRequiredDomos = (guests: number, maxGuestsPerDomo: number): number => {
  return Math.ceil(guests / maxGuestsPerDomo);
};

// Función auxiliar para encontrar unidad por ID
const findUnitById = async (unitId: string) => {
  if (!unitId) return null;
  
  try {
    const { supabase } = await import('@/lib/supabase');
    
    const { data, error } = await supabase
      .from('glamping_units')
      .select('*')
      .eq('id', unitId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching unit by ID:', error);
    return null;
  }
};

export const useUnitDetailController = () => {
  const { unitId = "" } = useParams<{ unitId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const { toast: uiToast } = useToast();
  
  // Estados generales
  const [isLoading, setIsLoading] = useState(false);
  const [displayUnit, setDisplayUnit] = useState<any>(null);
  const [isReservationConfirmed, setIsReservationConfirmed] = useState(false);
  const [confirmedReservationId, setConfirmedReservationId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  
  // Estados de fecha y huéspedes
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(2);
  const [requiredDomos, setRequiredDomos] = useState<number>(1);
  
  // Estados de disponibilidad
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isPartialAvailability, setPartialAvailability] = useState(false);
  const [availableDomos, setAvailableDomos] = useState<number>(0);
  const [alternativeDates, setAlternativeDates] = useState<{startDate: Date, endDate: Date}[]>([]);
  const [checkedAvailability, setCheckedAvailability] = useState(false);
  
  // Estados de cotización
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Estados de extras
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<ThemedPackage[]>([]);
  const [activitiesTotal, setActivitiesTotal] = useState(0);
  const [packagesTotal, setPackagesTotal] = useState(0);
  
  // Estado de navegación de pestañas
  const [reservationTab, setReservationTab] = useState("dates");
  
  // Hooks
  const { checkAvailability, checkDetailedAvailability } = useAvailabilityCheck({ 
    setIsLoading, 
    toast: uiToast 
  });

  // Aquí usamos el calculatePrice importado correctamente
  const { calculatePrice: calcPrice } = calculatePrice();
  
  const { createReservation } = useReservationCreation({ 
    setIsLoading, 
    toast: uiToast,
    checkAvailability 
  });
  
  // Obtener unidad para mostrar
  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const unit = await findUnitById(unitId);
        if (unit) {
          setDisplayUnit(unit);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error('Error fetching unit details:', error);
      }
    };
    
    if (unitId) {
      fetchUnitDetails();
    }
  }, [unitId, navigate]);
  
  // Calcular domos requeridos cuando cambia el número de huéspedes
  useEffect(() => {
    if (displayUnit) {
      const requiredDomosCount = calculateRequiredDomos(guests, displayUnit.max_guests || 4);
      setRequiredDomos(requiredDomosCount);
    }
  }, [guests, displayUnit]);
  
  // Calcular totales de actividades y paquetes
  useEffect(() => {
    const calculateActivitiesTotal = () => {
      return selectedActivities.reduce((total, activity) => total + activity.price, 0);
    };
    
    const calculatePackagesTotal = () => {
      return selectedPackages.reduce((total, pkg) => total + pkg.price, 0);
    };
    
    setActivitiesTotal(calculateActivitiesTotal());
    setPackagesTotal(calculatePackagesTotal());
  }, [selectedActivities, selectedPackages]);
  
  // Función para verificar disponibilidad
  const checkDatesAvailability = async () => {
    if (startDate && endDate && displayUnit && !checkedAvailability) {
      try {
        // Verificar disponibilidad detallada
        const availabilityDetails = await checkDetailedAvailability(
          displayUnit.id,
          startDate,
          endDate
        );
        
        // Extraer datos de disponibilidad
        const { isAvailable, availableUnits, totalUnits } = availabilityDetails;
        
        // Esta es la línea clave para corregir el problema de inconsistencia
        // Ahora usamos el valor real de availableUnits en vez de hardcodear valores
        // Marcar disponibilidad parcial si corresponde
        const allAvailable = availableUnits >= requiredDomos;
        
        if (availableUnits > 0 && availableUnits < requiredDomos) {
          // Disponibilidad parcial (algunos domos disponibles pero no los suficientes)
          setPartialAvailability(true);
          setAvailableDomos(availableUnits);
          
          toast.warning(
            `Solo tenemos ${availableUnits} de ${totalUnits} domos disponibles para las fechas seleccionadas.`, 
            { duration: 6000 }
          );
        } else {
          // O todos disponibles o ninguno disponible
          setPartialAvailability(false);
          setAvailableDomos(availableUnits);
          
          if (allAvailable) {
            toast.success(`Tenemos disponibilidad para los ${requiredDomos} domos necesarios (${availableUnits} de ${totalUnits}).`);
          } else {
            toast.error(`No hay domos disponibles (${availableUnits} de ${totalUnits}) para las fechas seleccionadas.`);
          }
        }
        
        setIsAvailable(allAvailable);
        setCheckedAvailability(true);
        
        return allAvailable;
      } catch (error) {
        console.error("Error al verificar disponibilidad:", error);
        toast.error("Ocurrió un error al verificar la disponibilidad");
        return false;
      }
    }
    return false;
  };
  
  // Calcular cotización
  const calculateQuotePrice = useCallback(async () => {
    if (!startDate || !endDate || !displayUnit) return null;
    
    try {
      setIsLoading(true);
      
      const priceDetails = await calcPrice(
        displayUnit.id,
        startDate,
        endDate,
        guests,
        0 // Pets
      );
      
      return priceDetails;
    } catch (error) {
      console.error('Error calculating quote:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, displayUnit, guests, calcPrice, setIsLoading]);
  
  // Gestión de la cotización
  const handleNewQuote = useCallback(async () => {
    setShowQuote(false);
    setCheckedAvailability(false);
  }, []);
  
  const checkAvailabilityAndQuote = useCallback(async () => {
    const isAvailable = await checkDatesAvailability();
    
    if (isAvailable) {
      const quoteData = await calculateQuotePrice();
      
      if (quoteData) {
        setQuote(quoteData);
        setShowQuote(true);
        setReservationTab("dates");
      }
    }
  }, [checkDatesAvailability, calculateQuotePrice]);
  
  // Manejar reserva
  const handleReservation = async () => {
    if (!startDate || !endDate) {
      toast.error("Por favor selecciona las fechas de entrada y salida");
      return;
    }
    
    // Verificamos si hay suficientes domos disponibles
    if (availableDomos !== undefined && requiredDomos > availableDomos) {
      const availabilityPercentage = Math.round((availableDomos / 4) * 100);
      toast.error(`Solo hay ${availableDomos} de 4 domos disponibles (${availabilityPercentage}%) para las fechas seleccionadas. Por favor, reduzca la cantidad de domos requeridos o seleccione otras fechas.`);
      return;
    }

    await checkAvailabilityAndQuote();
  };

  // Gestión de extras (actividades y paquetes)
  const handleActivityToggle = (activity: Activity) => {
    setSelectedActivities(prev => {
      const exists = prev.some(item => item.id === activity.id);
      
      if (exists) {
        return prev.filter(item => item.id !== activity.id);
      } else {
        return [...prev, activity];
      }
    });
  };
  
  const handlePackageToggle = (pkg: ThemedPackage) => {
    setSelectedPackages(prev => {
      const exists = prev.some(item => item.id === pkg.id);
      
      if (exists) {
        return prev.filter(item => item.id !== pkg.id);
      } else {
        return [...prev, pkg];
      }
    });
  };
  
  // Total actualizado con extras
  const getUpdatedQuoteTotal = useCallback(() => {
    if (!quote) return 0;
    
    return quote.totalPrice + activitiesTotal + packagesTotal;
  }, [quote, activitiesTotal, packagesTotal]);
  
  // Manejar confirmación de reserva
  const handleConfirmReservation = async () => {
    if (!displayUnit || !startDate || !endDate || !quote) return;

    try {
      // Verificamos si hay suficientes domos disponibles
      if (availableDomos !== undefined && requiredDomos > availableDomos) {
        toast.error(`Solo hay ${availableDomos} domos disponibles para las fechas seleccionadas. No es posible reservar ${requiredDomos} domos.`);
        return;
      }

      setIsProcessingPayment(true);
      
      const activityIds = selectedActivities.map(a => a.id);
      const packageIds = selectedPackages.map(p => p.id);
      
      const reservations = [];
      for (let i = 0; i < requiredDomos; i++) {
        const individualQuotePrice = quote.totalPrice / requiredDomos;
        
        const reservation = await createReservation(
          displayUnit.id,
          startDate,
          endDate,
          Math.ceil(guests / requiredDomos),
          individualQuotePrice,
          'webpay',
          i === 0 ? activityIds : [],
          i === 0 ? packageIds : []
        );
        
        if (reservation) {
          reservations.push(reservation);
        }
      }
      
      if (reservations.length > 0) {
        // Redirigir a WebPay (función a implementar)
        console.log(`Redirecting to WebPay for reservation ${reservations[0].id}`);
        // navigate(`/webpay-return?success=true&reservation_id=${reservations[0].id}`);
      }
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      toast.error("Ha ocurrido un error al procesar tu reserva. Por favor, intenta nuevamente.");
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  // Redirigir a WebPay
  const redirectToWebpay = async (reservationId: string, amount: number) => {
    // Este método requiere ser implementado con la integración de WebPay
    console.log(`Redirecting to WebPay for reservation ${reservationId} with amount ${amount}`);
    
    // Por ahora simulamos una redirección exitosa
    navigate(`/webpay-return?success=true&reservation_id=${reservationId}`);
  };
  
  // Comprobar parámetros URL para manejar retornos de pago
  const { handlePaymentReturn } = usePaymentStatus({ 
    setIsReservationConfirmed,
    setConfirmedReservationId,
    setPaymentDetails,
    setIsProcessingPayment,
    navigate
  });
  
  useEffect(() => {
    const checkUrlParams = () => {
      const paymentStatus = queryParams.get('status');
      const reservationId = queryParams.get('reservation_id');
      const token = queryParams.get('token_ws');
      
      if ((paymentStatus || token) && reservationId) {
        handlePaymentReturn(paymentStatus, reservationId, token);
      }
    };
    
    checkUrlParams();
  }, [location.search, queryParams, handlePaymentReturn]);

  return {
    // Estados
    isLoading,
    displayUnit,
    startDate,
    endDate,
    guests,
    requiredDomos,
    isAvailable,
    isPartialAvailability,
    availableDomos,
    alternativeDates,
    showQuote,
    quote,
    isProcessingPayment,
    selectedActivities,
    selectedPackages,
    activitiesTotal,
    packagesTotal,
    reservationTab,
    isReservationConfirmed,
    confirmedReservationId,
    paymentDetails,
    confirmationRef,
    
    // Setters
    setStartDate,
    setEndDate,
    setGuests,
    setReservationTab,
    
    // Acciones
    handleReservation,
    handleNewQuote,
    handleConfirmReservation,
    handleActivityToggle,
    handlePackageToggle,
    checkDatesAvailability,
    getUpdatedQuoteTotal,
    redirectToWebpay
  };
};
