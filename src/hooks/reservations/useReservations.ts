
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reservation, AvailabilityResult } from "@/types";

// Hook para obtener reservas
export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async (): Promise<Reservation[]> => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reservations:', error);
        throw error;
      }

      // Transform the data to match our Reservation interface
      return (data || []).map(item => ({
        ...item,
        adults: item.adults || Math.max(1, item.guests - (item.children || 0)),
        children: item.children || 0,
        required_domes: item.required_domes || Math.ceil(item.guests / 4)
      }));
    },
  });
};

// Hook para funciones de reserva
export const useReservationFunctions = () => {
  const checkAvailability = async (
    guests: number,
    checkIn: Date,
    checkOut: Date,
    forceRefresh?: boolean
  ): Promise<AvailabilityResult> => {
    // Implementar lógica de disponibilidad real
    const requiredDomos = Math.ceil(guests / 4);
    return {
      isAvailable: true,
      availableDomes: 3,
      requiredDomos,
    };
  };

  const createReservation = async (
    unitId: string,
    checkIn: Date,
    checkOut: Date,
    guests: number,
    totalPrice: number,
    paymentMethod: string,
    selectedActivities: any[],
    selectedPackages: any[],
    requiredDomes: number
  ) => {
    // Implementar lógica de creación
    return { success: true };
  };

  const calculateQuote = async (data: any) => {
    // Implementar lógica de cotización
    return { total: 0 };
  };

  const redirectToWebpay = async (data: any) => {
    // Implementar lógica de webpay
    return { url: '' };
  };

  const fetchGlampingUnits = async () => {
    // Implementar lógica de unidades
    return [];
  };

  return {
    checkAvailability,
    createReservation,
    calculateQuote,
    redirectToWebpay,
    fetchGlampingUnits
  };
};
