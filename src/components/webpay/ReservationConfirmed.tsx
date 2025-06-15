
import React from 'react';
import { Button } from '@/components/ui/button';
import { TransactionResult } from '@/services/webpay/types';
import { ReservationDetails } from '@/components/unit-detail/ReservationDetails';
import { format, differenceInDays } from 'date-fns';
import { formatReservationId } from '@/lib/utils';

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
  
  // Prepare quote object for ReservationDetails
  const getQuoteFromTransaction = () => {
    if (!transactionResult) return null;
    
    const checkIn = transactionResult.reservation_data?.check_in 
      ? new Date(transactionResult.reservation_data.check_in) 
      : undefined;
      
    const checkOut = transactionResult.reservation_data?.check_out 
      ? new Date(transactionResult.reservation_data.check_out) 
      : undefined;
      
    const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
    
    const basePrice = transactionResult.amount || 0;
    const activitiesTotal = transactionResult.reservation_data?.activities_total || 0;
    const packagesTotal = transactionResult.reservation_data?.packages_total || 0;
    const petsPrice = transactionResult.reservation_data?.pets_price || 0;
    const pets = transactionResult.reservation_data?.pets || 0;
    const guests = transactionResult.reservation_data?.guests || 4;
    
    // Calculate required domos based on guests
    const requiredDomos = Math.ceil(guests / 4);
    
    console.log('🔍 [ReservationConfirmed] Calculando domos requeridos:', {
      guests,
      requiredDomos,
      basePrice,
      nights
    });
    
    // Create dome distribution - distribute guests evenly across domos
    const guestsPerDomo = Math.floor(guests / requiredDomos);
    const extraGuests = guests % requiredDomos;
    
    const domoDistribution = Array.from({ length: requiredDomos }, (_, index) => ({
      number: index + 1,
      guests: guestsPerDomo + (index < extraGuests ? 1 : 0),
      unitId: (index + 1).toString()
    }));
    
    // Create breakdown for each dome with correct pricing
    const accommodationPrice = basePrice - activitiesTotal - packagesTotal - petsPrice;
    const pricePerDome = accommodationPrice / requiredDomos;
    
    const breakdown = domoDistribution.map((domo, index) => ({
      description: `Domo ${domo.number}: ${domo.guests} ${domo.guests === 1 ? 'persona' : 'personas'}`,
      amount: Math.round(pricePerDome),
      guests: domo.guests,
      domoNumber: domo.number
    }));
    
    console.log('✅ [ReservationConfirmed] Quote generado:', {
      requiredDomos,
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
      pets,
      totalPrice: basePrice,
      requiredDomos,
      domoDistribution,
      breakdown,
      selectedActivities: transactionResult.reservation_data?.selected_activities || [],
      selectedPackages: transactionResult.reservation_data?.selected_packages || []
    };
  };

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
          <div className="bg-blue-50 p-4 rounded-md mb-4 text-center">
            <p className="text-blue-700 font-medium mb-1">Tu código de reserva es:</p>
            <p className="text-2xl font-bold text-blue-800">
              {transactionResult.reservation_data?.reservation_code || 
               formatReservationId(transactionResult.reservation_id)}
            </p>
            <p className="text-sm text-blue-600 mt-1">Guarda este código para futuras consultas</p>
          </div>
          
          {/* Show multiple domos info if applicable */}
          {transactionResult.reservation_data?.guests && 
           Math.ceil(transactionResult.reservation_data.guests / 4) > 1 && (
            <div className="bg-amber-50 p-4 rounded-md mb-4">
              <p className="text-amber-800 font-medium mb-2">
                Tu reserva incluye {Math.ceil(transactionResult.reservation_data.guests / 4)} domos:
              </p>
              <p className="text-sm text-amber-700">
                Para {transactionResult.reservation_data.guests} huéspedes hemos reservado{' '}
                {Math.ceil(transactionResult.reservation_data.guests / 4)} domos geodésicos.
                Cada domo tiene capacidad para hasta 4 personas.
              </p>
            </div>
          )}
          
          <ReservationDetails
            startDate={transactionResult.reservation_data?.check_in ? new Date(transactionResult.reservation_data.check_in) : undefined}
            endDate={transactionResult.reservation_data?.check_out ? new Date(transactionResult.reservation_data.check_out) : undefined}
            guests={transactionResult.reservation_data?.guests}
            quote={getQuoteFromTransaction()}
            paymentDetails={transactionResult}
          />
        </div>
      )}
    </div>
  );
};

export default ReservationConfirmed;
