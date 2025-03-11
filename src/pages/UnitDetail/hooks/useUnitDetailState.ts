import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReservations } from "@/hooks/reservations";
import { supabase, type GlampingUnit } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { packageData } from "@/components/packages/packageData";
import { Activity, ThemedPackage } from "@/types";

export interface UnitDetailState {
  startDate?: Date;
  setStartDate: (date: Date | undefined) => void;
  endDate?: Date;
  setEndDate: (date: Date | undefined) => void;
  guests: number;
  setGuests: (guests: number) => void;
  adults: number;
  setAdults: (adults: number) => void;
  children: number;
  setChildren: (children: number) => void;
  requiredDomos: number;
  checkAvailability: any;
  calculateQuote: any;
  createReservation: any;
  redirectToWebpay: any;
  toast: any;
  quote: any;
  setQuote: (quote: any) => void;
  isAvailable: boolean | null;
  setIsAvailable: (isAvailable: boolean) => void;
  showQuote: boolean;
  setShowQuote: (showQuote: boolean) => void;
  isReservationConfirmed: boolean;
  setIsReservationConfirmed: (isConfirmed: boolean) => void;
  displayUnit: GlampingUnit | null;
  isProcessingPayment: boolean;
  setIsProcessingPayment: (isProcessing: boolean) => void;
  paymentDetails: any;
  setPaymentDetails: (details: any) => void;
  checkedAvailability: boolean;
  setCheckedAvailability: (checked: boolean) => void;
  selectedActivities: Activity[];
  setSelectedActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  selectedPackages: ThemedPackage[];
  setSelectedPackages: React.Dispatch<React.SetStateAction<ThemedPackage[]>>;
  activitiesTotal: number;
  packagesTotal: number;
  reservationTab: string;
  setReservationTab: (tab: string) => void;
  confirmedReservationId: string | null;
  setConfirmedReservationId: (id: string | null) => void;
  clientInformation: {
    name: string;
    email: string;
    phone: string;
  };
  setClientInformation: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
  }>>;
  confirmationRef: React.RefObject<HTMLDivElement>;
  isPartialAvailability: boolean;
  setPartialAvailability: (isPartial: boolean) => void;
  availableDomos: number;
  setAvailableDomos: (availableDomos: number) => void;
  alternativeDates: {startDate: Date, endDate: Date}[];
  setAlternativeDates: React.Dispatch<React.SetStateAction<{startDate: Date, endDate: Date}[]>>;
}

export const useUnitDetailState = (unitId: string | undefined): UnitDetailState => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [guests, setGuests] = useState<number>(1);
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [requiredDomos, setRequiredDomos] = useState<number>(1);
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
  const [isPartialAvailability, setPartialAvailability] = useState<boolean>(false);
  const [availableDomos, setAvailableDomos] = useState<number>(0);
  const [alternativeDates, setAlternativeDates] = useState<{startDate: Date, endDate: Date}[]>([]);

  useEffect(() => {
    const MAX_GUESTS_PER_DOMO = 4;
    const domos = Math.ceil(guests / MAX_GUESTS_PER_DOMO);
    setRequiredDomos(domos);
  }, [guests]);

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
    displayUnit,
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
    setPartialAvailability,
    availableDomos,
    setAvailableDomos,
    alternativeDates,
    setAlternativeDates
  };
};
