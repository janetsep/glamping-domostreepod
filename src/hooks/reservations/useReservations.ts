
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reservation } from "@/types";

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

      return data || [];
    },
  });
};

// Hook para funciones de reserva (simulado por ahora)
export const useReservationFunctions = () => {
  const checkAvailability = async (unitId: string, checkIn: Date, checkOut: Date): Promise<boolean> => {
    // Implementar lógica de disponibilidad
    return true;
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
