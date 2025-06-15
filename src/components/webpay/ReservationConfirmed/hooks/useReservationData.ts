
import { useState, useEffect } from 'react';
import { differenceInDays } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { TransactionResult } from '@/services/webpay/types';

export const useReservationData = (transactionResult: TransactionResult | null) => {
  const [allReservations, setAllReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllReservations = async () => {
      if (!transactionResult?.reservation_id) {
        console.log('❌ [useReservationData] No reservation_id found in transactionResult');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 [useReservationData] Buscando TODAS las reservas para reservation_id:', transactionResult.reservation_id);
        
        // Get primary reservation to get the reservation code
        const { data: primaryReservation, error: primaryError } = await supabase
          .from('reservations')
          .select('*, reservation_code')
          .eq('id', transactionResult.reservation_id)
          .single();
        
        if (primaryError || !primaryReservation) {
          console.error('❌ [useReservationData] Error obteniendo reserva principal:', primaryError);
          setIsLoading(false);
          return;
        }

        console.log('📋 [useReservationData] Reserva principal encontrada:', {
          id: primaryReservation.id,
          codigo: primaryReservation.reservation_code,
          huespedes: primaryReservation.guests,
          precio: primaryReservation.total_price,
          status: primaryReservation.status
        });

        if (!primaryReservation.reservation_code) {
          console.error('❌ [useReservationData] No se encontró código de reserva');
          setAllReservations([primaryReservation]);
          setIsLoading(false);
          return;
        }

        // Get ALL reservations with the same reservation code
        const { data: allReservations, error: allError } = await supabase
          .from('reservations')
          .select('*')
          .eq('reservation_code', primaryReservation.reservation_code)
          .eq('status', 'confirmed')
          .order('unit_id');
        
        if (allError || !allReservations) {
          console.error('❌ [useReservationData] Error obteniendo todas las reservas:', allError);
          setAllReservations([primaryReservation]);
          setIsLoading(false);
          return;
        }

        console.log('✅ [useReservationData] TODAS las reservas obtenidas:', {
          total: allReservations.length,
          reservas: allReservations.map(r => ({
            id: r.id,
            unitId: r.unit_id,
            huespedes: r.guests,
            precio: r.total_price,
            status: r.status
          }))
        });

        setAllReservations(allReservations);
      } catch (error) {
        console.error('❌ [useReservationData] Error general:', error);
        setAllReservations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllReservations();
  }, [transactionResult?.reservation_id]);

  // Prepare quote object for ReservationDetails using all reservations
  const getQuoteFromTransaction = () => {
    if (!transactionResult || allReservations.length === 0) {
      console.log('❌ [useReservationData] No transactionResult o no hay reservas');
      return null;
    }
    
    const checkIn = transactionResult.reservation_data?.check_in 
      ? new Date(transactionResult.reservation_data.check_in) 
      : undefined;
      
    const checkOut = transactionResult.reservation_data?.check_out 
      ? new Date(transactionResult.reservation_data.check_out) 
      : undefined;
      
    const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
    
    // Calculate totals from ALL reservations (not just transaction data)
    const totalGuests = allReservations.reduce((sum, res) => sum + res.guests, 0);
    const totalPrice = allReservations.reduce((sum, res) => sum + res.total_price, 0);
    const requiredDomos = allReservations.length;

    console.log('🔍 [useReservationData] Calculando quote con TODAS las reservas:', {
      totalGuests,
      totalPrice,
      requiredDomos,
      nights,
      allReservations: allReservations.map(r => ({ id: r.id, guests: r.guests, price: r.total_price }))
    });

    const activitiesTotal = transactionResult.reservation_data?.activities_total || 0;
    const packagesTotal = transactionResult.reservation_data?.packages_total || 0;
    const totalPets = allReservations.reduce((sum, res) => sum + (res.pets || 0), 0);
    const petsPrice = totalPets * 25000;
    
    // Create dome distribution using all reservations
    const domoDistribution = allReservations.map((res, index) => ({
      number: index + 1,
      guests: res.guests,
      unitId: res.unit_id
    }));
    
    // Create breakdown showing each dome with its individual price
    const breakdown = allReservations.map((res, index) => ({
      description: `Domo ${index + 1} (Unidad ${res.unit_id}): ${res.guests} ${res.guests === 1 ? 'persona' : 'personas'}`,
      amount: res.total_price,
      guests: res.guests,
      domoNumber: index + 1
    }));
    
    // Calculate accommodation price (total minus extras)
    const accommodationPrice = totalPrice - activitiesTotal - packagesTotal - petsPrice;
    
    console.log('✅ [useReservationData] Quote generado con MÚLTIPLES domos:', {
      requiredDomos,
      totalGuests,
      totalPrice,
      domoDistribution,
      breakdown,
      accommodationPrice
    });
    
    return {
      nights,
      basePrice: accommodationPrice,
      activitiesTotal,
      packagesTotal,
      petsPrice,
      pets: totalPets,
      totalPrice: totalPrice,
      requiredDomos,
      domoDistribution,
      breakdown,
      selectedActivities: transactionResult.reservation_data?.selected_activities || [],
      selectedPackages: transactionResult.reservation_data?.selected_packages || []
    };
  };

  const totalGuests = allReservations.reduce((sum, res) => sum + res.guests, 0);
  const requiredDomos = allReservations.length;

  return {
    allReservations,
    isLoading,
    totalGuests,
    requiredDomos,
    getQuoteFromTransaction
  };
};
