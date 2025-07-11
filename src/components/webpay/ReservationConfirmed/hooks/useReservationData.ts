import { useState, useEffect } from "react";
import { TransactionResult } from "@/services/webpay/types";
import { supabase } from "@/lib/supabase";

// Hook para recolectar todas las reservas asociadas al mismo código y mostrar el resumen correcto
export function useReservationData(transactionResult: TransactionResult) {
  const [allReservations, setAllReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalGuests, setTotalGuests] = useState(0);
  const [requiredDomos, setRequiredDomos] = useState(1);
  const [reservationCode, setReservationCode] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReservations() {
      setIsLoading(true);

      if (!transactionResult?.reservation_id) {
        setIsLoading(false);
        return;
      }

      // Obtener el reservation_code de la reserva principal
      const { data: mainRes, error: resError } = await supabase
        .from("reservations")
        .select("reservation_code, check_in, check_out, total_price, guests")
        .eq("id", transactionResult.reservation_id)
        .maybeSingle();

      if (resError || !mainRes?.reservation_code) {
        setAllReservations([]);
        setTotalGuests(0);
        setRequiredDomos(1);
        setIsLoading(false);
        return;
      }

      // Buscar todas las reservas asociadas a ese código
      const { data: reservations, error } = await supabase
        .from("reservations")
        .select("id, guests, unit_id")
        .eq("reservation_code", mainRes.reservation_code);

      // Guardar el código de reserva real
      setReservationCode(mainRes.reservation_code);

      if (reservations && reservations.length > 0) {
        setAllReservations(reservations);
        // Sumar huéspedes y contabilizar domos
        setTotalGuests(reservations.reduce((sum, r) => sum + (r.guests || 0), 0));
        setRequiredDomos(reservations.length);
      } else {
        setAllReservations([]);
        setTotalGuests(0);
        setRequiredDomos(1);
      }

      setIsLoading(false);
    }
    fetchReservations();
    // Solo volver a correr si cambia el ID
  }, [transactionResult?.reservation_id]);

  // Lógica para supply el quote
  function getQuoteFromTransaction() {
    return transactionResult?.reservation_data || {};
  }

  return {
    allReservations,
    isLoading,
    totalGuests,
    requiredDomos,
    reservationCode,
    getQuoteFromTransaction
  };
}
