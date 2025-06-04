import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReservations } from "@/hooks/reservations";
import { supabase, type GlampingUnit } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { packageData } from "@/components/packages/packageData";
import { Activity, ThemedPackage } from "@/types";

interface Quote {
  nights: number;
  basePrice: number;
  activitiesTotal: number;
  packagesTotal: number;
  petsPrice: number;
  pets: number;
  totalPrice: number;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
}

interface PaymentDetails {
  amount: number;
  currency: string;
  status: string;
  transactionId: string;
}

export const useUnitDetailState = (unitId: string | undefined) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [guests, setGuests] = useState<number>(1);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [requiredDomos, setRequiredDomos] = useState<number>(1);
  const { checkAvailability, calculateQuote, createReservation, fetchGlampingUnits, redirectToWebpay } = useReservations();
  const { toast } = useToast();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [showQuote, setShowQuote] = useState(false);
  const [isReservationConfirmed, setIsReservationConfirmed] = useState(false);
  const [fallbackUnit, setFallbackUnit] = useState<GlampingUnit | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [checkedAvailability, setCheckedAvailability] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<ThemedPackage[]>([]);
  const [activitiesTotal, setActivitiesTotal] = useState(0);
  const [packagesTotal, setPackagesTotal] = useState(0);
  const [reservationTab, setReservationTab] = useState("dates");
  const [confirmedReservationId, setConfirmedReservationId] = useState<string | null>(null);
  const [clientInformation, setClientInformation] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({
    name: '',
    email: '',
    phone: ''
  });
  const confirmationRef = useRef<HTMLDivElement>(null);
  const [isPartialAvailability, setIsPartialAvailability] = useState(false);
  const [availableDomos, setAvailableDomos] = useState<number>(0);
  const [alternativeDates, setAlternativeDates] = useState<{startDate: Date, endDate: Date}[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // Ref para rastrear la última solicitud de verificación de disponibilidad
  const availabilityCheckRef = useRef<{ guests: number; startDate: Date; endDate: Date } | null>(null);

  // Efecto para depurar cambios en las fechas
  useEffect(() => {
    console.log('🔍 [useUnitDetailState] Fechas actualizadas:', {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString()
    });
  }, [startDate, endDate]);

  // Efecto para actualizar el total de huéspedes cuando cambian adultos o niños
  useEffect(() => {
    const newGuests = adults + children;
    setGuests(newGuests);
  }, [adults, children]);

  // Efecto para actualizar requiredDomos cuando cambia el número de huéspedes
  useEffect(() => {
    const newRequiredDomos = Math.ceil(guests / 4);
    console.log('🔍 [useUnitDetailState] Actualizando requiredDomos:', {
      guests,
      newRequiredDomos,
      currentRequiredDomos: requiredDomos
    });
    setRequiredDomos(newRequiredDomos);
  }, [guests]);

  // Efecto para verificar disponibilidad cuando cambian las fechas
  useEffect(() => {
    const checkAvailabilityForDates = async () => {
      if (!startDate || !endDate || !unitId) return;

      console.log('🔍 [useUnitDetailState] Verificando disponibilidad para fechas:', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        requiredDomos
      });

      try {
        const result = await checkAvailability(guests, startDate, endDate, unitId);
        console.log('🔍 [useUnitDetailState] Resultado de disponibilidad:', result);

        setIsAvailable(result.isAvailable);
        setAvailableDomos(result.availableDomes || 0);
        setIsPartialAvailability(result.isAvailable && (result.availableDomes || 0) < requiredDomos);
        setCheckedAvailability(true);

        if (!result.isAvailable || (result.availableDomes || 0) < requiredDomos) {
          // Buscar fechas alternativas
          const alternatives = await findAlternativeDates(startDate, endDate, requiredDomos);
          console.log('🔍 [useUnitDetailState] Fechas alternativas encontradas:', alternatives);
          setAlternativeDates(alternatives);
        } else {
          setAlternativeDates([]);
        }
      } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        setIsAvailable(false);
        setAvailableDomos(0);
        setIsPartialAvailability(false);
        setAlternativeDates([]);
      }
    };

    checkAvailabilityForDates();
  }, [startDate, endDate, unitId, guests, requiredDomos]);

  // Función para encontrar fechas alternativas
  const findAlternativeDates = async (
    originalStart: Date,
    originalEnd: Date,
    requiredDomos: number
  ): Promise<{startDate: Date, endDate: Date}[]> => {
    const alternatives: {startDate: Date, endDate: Date}[] = [];
    const daysToCheck = 7; // Buscar 7 días antes y después

    for (let i = -daysToCheck; i <= daysToCheck; i++) {
      if (i === 0) continue; // Saltar las fechas originales

      const newStart = new Date(originalStart);
      newStart.setDate(newStart.getDate() + i);
      
      const newEnd = new Date(originalEnd);
      newEnd.setDate(newEnd.getDate() + i);

      try {
        const result = await checkAvailability(guests, newStart, newEnd, unitId || '');
        if (result.isAvailable && (result.availableDomes || 0) >= requiredDomos) {
          alternatives.push({
            startDate: newStart,
            endDate: newEnd
          });
        }
      } catch (error) {
        console.error('Error al buscar fechas alternativas:', error);
      }
    }

    return alternatives;
  };

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isReservationConfirmed && confirmationRef.current) {
      confirmationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isReservationConfirmed]);

  useEffect(() => {
    if (unitId) {
      const packageItem = packageData.find(pkg => pkg.id === unitId);
      if (packageItem) {
        const packageUnit: GlampingUnit = {
          id: packageItem.id,
          name: packageItem.title,
          description: packageItem.detailedDescription,
          max_guests: 4,
          prices: {
            base_price: packageItem.price
          },
          image_url: packageItem.image,
        };
        setFallbackUnit(packageUnit);
      }
    }
  }, [unitId]);

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

  const displayUnit = unit || fallbackUnit;

  const checkUnitAvailability = async (guests: number, startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) {
      console.log('🔍 [useUnitDetailState] Fechas no seleccionadas, reseteando disponibilidad y cotización');
      setAvailableDomos(4); // Restablecer a 4 domos disponibles (default)
      setIsAvailable(false); // Considerar no disponible sin fechas
      setIsPartialAvailability(false);
      setQuote(null); // Resetear cotización
      setAvailabilityError(null);
      setRequiredDomos(1); // Restablecer a 1 domo requerido
      return;
    }

    // Almacenar los parámetros de la solicitud actual
    availabilityCheckRef.current = { guests, startDate, endDate };

    console.log('🔍 [useUnitDetailState] Realizando verificación de disponibilidad con:', { guests, startDate, endDate });
    // NOTA: checkAvailability espera un objeto { start: Date, end: Date }
    const result = await checkAvailability(guests, startDate, endDate, true);
    console.log('🔍 [useUnitDetailState] Resultado de checkAvailability:', result);

    // Verificar nuevamente si esta es la solicitud más reciente antes de actualizar el estado
    if (availabilityCheckRef.current && (
      availabilityCheckRef.current.guests !== guests ||
      availabilityCheckRef.current.startDate.getTime() !== startDate.getTime() ||
      availabilityCheckRef.current.endDate.getTime() !== endDate.getTime()
    )) {
      console.log('🔍 [useUnitDetailState] Solicitud antigua detectada antes de actualizar estado, abortando.');
      return;
    }

    if (result && typeof result === 'object' && 'availableDomes' in result && 'isAvailable' in result) {
      console.log('🔍 [useUnitDetailState] Actualizando estado con:', { availableDomes: result.availableDomes, isAvailable: result.isAvailable, partialAvailability: result.availableDomes > 0 && result.availableDomes < requiredDomos });
      setAvailableDomos(result.availableDomes);
      setIsAvailable(result.isAvailable);
      setAvailabilityError(result.error || null); // Asegurarse de que sea string o null

      // Calcular partialAvailability basado en el resultado
      setIsPartialAvailability(result.availableDomes > 0 && result.availableDomes < requiredDomos);
    } else {
      // Si la verificación falla o no devuelve el formato esperado, asumir no disponibilidad
      console.log('❌ [useUnitDetailState] Verificación de disponibilidad fallida o formato inesperado.');
      setAvailableDomos(0); // 0 domos disponibles
      setIsAvailable(false); // No disponible
      setIsPartialAvailability(false);
      setAvailabilityError('Error al verificar disponibilidad');
    }
  };

  // Ejecutar verificación de disponibilidad cada vez que cambian fechas o huéspedes
  useEffect(() => {
    console.log('🔍 [useUnitDetailState] useEffect disparado. Fechas/huéspedes actuales:', { startDate, endDate, guests, requiredDomos });
    // Solo ejecutar si ambas fechas son válidas y hay huéspedes > 0
    if (startDate instanceof Date && endDate instanceof Date && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && guests > 0) {
      // Almacenar la información de la solicitud más reciente
      availabilityCheckRef.current = { guests, startDate, endDate };
      console.log('🔍 [useUnitDetailState] Fechas/huéspedes válidos, iniciando verificación.');
      checkUnitAvailability(guests, startDate, endDate);
    } else {
       // Si las fechas o huéspedes no son válidos, resetear estado
      console.log('🔍 [useUnitDetailState] Fechas/huéspedes no válidos, reseteando estado.');
      availabilityCheckRef.current = null; // Cancelar cualquier verificación pendiente
      setAvailableDomos(4); // 4 domos disponibles por defecto
      setIsAvailable(null); // Estado inicial o desconocido
      setIsPartialAvailability(false);
      setQuote(null); // También resetear cotización
      setShowQuote(false);
    }
  }, [startDate, endDate, guests, requiredDomos, checkAvailability]); // Dependencias ajustadas

  const handleNewQuote = async () => {
    if (!startDate || !endDate) {
      toast.error("Por favor selecciona las fechas de entrada y salida");
      return;
    }

    try {
      const newQuote = await calculateQuote(guests, startDate, endDate, unitId || '');
      setQuote(newQuote);
      setShowQuote(true);
      setIsPartialAvailability(false);
      setAlternativeDates([]);
    } catch (error) {
      console.error('Error al calcular cotización:', error);
      toast.error("Error al calcular la cotización");
    }
  };

  const handleConfirmReservation = async () => {
    if (!startDate || !endDate || !quote) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setIsProcessingPayment(true);
      
      // Usar solo los parámetros correctos para createReservation
      const reservation = await createReservation(
        unitId || '',
        startDate,
        endDate,
        guests,
        quote.totalPrice,
        'webpay',
        selectedActivities,
        selectedPackages
      );

      if (reservation) {
        setConfirmedReservationId(reservation.id);
        setIsReservationConfirmed(true);
        setIsPartialAvailability(false);
        setAlternativeDates([]);
      }
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      toast.error("Error al crear la reserva");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleReservation = async () => {
    if (!startDate || !endDate) {
      toast.error("Por favor selecciona las fechas de entrada y salida");
      return;
    }

    try {
      const result = await checkAvailability(guests, startDate, endDate, unitId || '');
      if (result.isAvailable && (result.availableDomes || 0) >= requiredDomos) {
        await handleNewQuote();
      } else {
        setIsPartialAvailability(result.isAvailable && (result.availableDomes || 0) < requiredDomos);
        setAvailableDomos(result.availableDomes || 0);
        toast.error("No hay disponibilidad para las fechas seleccionadas");
      }
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      toast.error("Error al verificar disponibilidad");
    }
  };

  const getCurrentStep = () => {
    if (isReservationConfirmed) return 4;
    if (isProcessingPayment) return 3;
    if (showQuote) return 2;
    return 1;
  };

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    guests,
    setGuests,
    adults,
    setAdults,
    children,
    setChildren,
    requiredDomos,
    setRequiredDomos,
    checkAvailability,
    calculateQuote,
    createReservation,
    redirectToWebpay,
    toast,
    quote,
    setQuote,
    isAvailable,
    setIsAvailable,
    showQuote,
    setShowQuote,
    isReservationConfirmed,
    setIsReservationConfirmed,
    displayUnit: unit || fallbackUnit,
    isProcessingPayment,
    setIsProcessingPayment,
    paymentDetails,
    setPaymentDetails,
    checkedAvailability,
    setCheckedAvailability,
    selectedActivities,
    setSelectedActivities,
    selectedPackages,
    setSelectedPackages,
    activitiesTotal,
    packagesTotal,
    reservationTab,
    setReservationTab,
    confirmedReservationId,
    setConfirmedReservationId,
    clientInformation,
    setClientInformation,
    confirmationRef,
    isPartialAvailability,
    setIsPartialAvailability,
    availableDomos,
    setAvailableDomos,
    alternativeDates,
    setAlternativeDates,
    loadingAvailability,
    availabilityError,
    getCurrentStep
  };
};
