
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TransactionResult } from '@/services/webpay/types';
import { ReservationDetails } from '@/components/unit-detail/ReservationDetails';
import { format, differenceInDays } from 'date-fns';
import { formatReservationId } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface ReservationConfirmedProps {
  transactionResult: TransactionResult;
  onSendEmail: () => void;
  isEmailSending: boolean;
  emailSent: boolean;
  onViewReservation: () => void;
}

const ReservationConfirmed: React.FC<ReservationConfirmedProps> = ({
  transactionResult,
  onSendEmail,
  isEmailSending,
  emailSent,
  onViewReservation
}) => {
  const [allReservations, setAllReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all reservations with the same reservation code
  useEffect(() => {
    const fetchAllReservations = async () => {
      if (!transactionResult?.reservation_id) {
        console.log('❌ [ReservationConfirmed] No reservation_id found in transactionResult');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 [ReservationConfirmed] DEBUG: transactionResult completo:', JSON.stringify(transactionResult, null, 2));
        console.log('🔍 [ReservationConfirmed] Obteniendo reserva principal:', transactionResult.reservation_id);
        
        // Get primary reservation to get the reservation code
        const { data: primaryReservation, error: primaryError } = await supabase
          .from('reservations')
          .select('*, reservation_code')
          .eq('id', transactionResult.reservation_id)
          .single();
        
        if (primaryError || !primaryReservation) {
          console.error('❌ [ReservationConfirmed] Error obteniendo reserva principal:', primaryError);
          console.log('🔍 [ReservationConfirmed] Intentando buscar por buy_order:', transactionResult.buy_order);
          
          // Fallback: try to find by buy_order pattern
          const { data: fallbackReservations, error: fallbackError } = await supabase
            .from('reservations')
            .select('*, reservation_code')
            .eq('status', 'confirmed')
            .order('created_at', { ascending: false })
            .limit(10);
            
          if (fallbackError || !fallbackReservations || fallbackReservations.length === 0) {
            console.error('❌ [ReservationConfirmed] No se encontraron reservas confirmadas recientes');
            setIsLoading(false);
            return;
          }
          
          console.log('🔍 [ReservationConfirmed] Reservas confirmadas recientes:', fallbackReservations);
          setAllReservations(fallbackReservations);
          setIsLoading(false);
          return;
        }

        console.log('📋 [ReservationConfirmed] Reserva principal encontrada:', {
          id: primaryReservation.id,
          codigo: primaryReservation.reservation_code,
          huespedes: primaryReservation.guests,
          precio: primaryReservation.total_price,
          status: primaryReservation.status
        });

        if (!primaryReservation.reservation_code) {
          console.error('❌ [ReservationConfirmed] No se encontró código de reserva, usando solo la reserva principal');
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
          console.error('❌ [ReservationConfirmed] Error obteniendo todas las reservas:', allError);
          // Usar solo la reserva principal como fallback
          setAllReservations([primaryReservation]);
          setIsLoading(false);
          return;
        }

        console.log('✅ [ReservationConfirmed] Todas las reservas obtenidas:', {
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
        console.error('❌ [ReservationConfirmed] Error general:', error);
        // Try to use just the transaction result data as fallback
        if (transactionResult.reservation_data) {
          console.log('🔄 [ReservationConfirmed] Usando datos del transactionResult como fallback');
          const fallbackReservation = {
            id: transactionResult.reservation_id,
            guests: transactionResult.reservation_data.guests || 4,
            total_price: transactionResult.amount || 0,
            unit_id: '1',
            reservation_code: transactionResult.reservation_data.reservation_code || formatReservationId(transactionResult.reservation_id)
          };
          setAllReservations([fallbackReservation]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllReservations();
  }, [transactionResult?.reservation_id, transactionResult?.buy_order]);
  
  // Prepare quote object for ReservationDetails using all reservations
  const getQuoteFromTransaction = () => {
    if (!transactionResult || allReservations.length === 0) {
      console.log('❌ [ReservationConfirmed] No transactionResult o no hay reservas');
      return null;
    }
    
    const checkIn = transactionResult.reservation_data?.check_in 
      ? new Date(transactionResult.reservation_data.check_in) 
      : undefined;
      
    const checkOut = transactionResult.reservation_data?.check_out 
      ? new Date(transactionResult.reservation_data.check_out) 
      : undefined;
      
    const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
    
    // Calculate totals from all reservations
    const totalGuests = allReservations.reduce((sum, res) => sum + res.guests, 0);
    const totalPrice = allReservations.reduce((sum, res) => sum + res.total_price, 0);
    const requiredDomos = allReservations.length;

    console.log('🔍 [ReservationConfirmed] Calculando quote:', {
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
    
    console.log('✅ [ReservationConfirmed] Quote generado:', {
      requiredDomos,
      domoDistribution,
      breakdown,
      accommodationPrice,
      totalPrice
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600">Cargando detalles de la reserva...</p>
        </div>
      </div>
    );
  }

  const totalGuests = allReservations.reduce((sum, res) => sum + res.guests, 0);
  const requiredDomos = allReservations.length;

  console.log('🔍 [ReservationConfirmed] Renderizando con:', {
    totalGuests,
    requiredDomos,
    allReservationsCount: allReservations.length,
    transactionResultId: transactionResult?.reservation_id
  });

  return (
    <div className="space-y-6">
      <div className="mt-6 text-center">
        <p className="text-green-600 font-medium mb-4">
          ¡Información guardada correctamente!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button 
            onClick={onSendEmail} 
            variant="default"
            disabled={isEmailSending || emailSent}
            className="w-full sm:w-auto"
          >
            {isEmailSending ? 'Enviando...' : 
              emailSent ? '✓ Enviado correctamente' : 
              'Enviar detalles a mi correo'}
          </Button>
          
          <Button 
            onClick={onViewReservation} 
            variant="outline"
            className="w-full sm:w-auto"
          >
            Ver detalles de mi reserva
          </Button>
        </div>
      </div>
      
      {transactionResult.reservation_id && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Detalles completos de tu reserva</h3>
          
          {/* DEBUG INFO - mostrar temporalmente */}
          <div className="bg-yellow-50 p-4 rounded-md mb-4 text-sm">
            <p><strong>DEBUG INFO:</strong></p>
            <p>Reservas encontradas: {allReservations.length}</p>
            <p>Total huéspedes: {totalGuests}</p>
            <p>Domos requeridos: {requiredDomos}</p>
            {allReservations.map((res, idx) => (
              <p key={idx}>Domo {idx + 1}: {res.guests} huéspedes, Unit {res.unit_id}</p>
            ))}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md mb-4 text-center">
            <p className="text-blue-700 font-medium mb-1">Tu código de reserva es:</p>
            <p className="text-2xl font-bold text-blue-800">
              {transactionResult.reservation_data?.reservation_code || 
               allReservations[0]?.reservation_code ||
               formatReservationId(transactionResult.reservation_id)}
            </p>
            <p className="text-sm text-blue-600 mt-1">Guarda este código para futuras consultas</p>
          </div>
          
          {/* Show multiple domos info */}
          {requiredDomos > 1 && (
            <div className="bg-amber-50 p-4 rounded-md mb-4">
              <p className="text-amber-800 font-medium mb-2">
                Tu reserva incluye {requiredDomos} domos:
              </p>
              <p className="text-sm text-amber-700 mb-2">
                Para {totalGuests} huéspedes hemos reservado {requiredDomos} domos geodésicos.
                Cada domo tiene capacidad para hasta 4 personas.
              </p>
              <div className="space-y-1">
                {allReservations.map((res, index) => (
                  <div key={res.id} className="text-sm text-amber-700">
                    • Domo {index + 1} (Unidad {res.unit_id}): {res.guests} {res.guests === 1 ? 'persona' : 'personas'}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <ReservationDetails
            startDate={transactionResult.reservation_data?.check_in ? new Date(transactionResult.reservation_data.check_in) : undefined}
            endDate={transactionResult.reservation_data?.check_out ? new Date(transactionResult.reservation_data.check_out) : undefined}
            guests={totalGuests}
            quote={getQuoteFromTransaction()}
            paymentDetails={transactionResult}
          />
        </div>
      )}
    </div>
  );
};

export default ReservationConfirmed;
