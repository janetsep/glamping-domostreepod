
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/components/ui/use-toast';

interface ClientInfo {
  name?: string;
  email?: string;
  phone?: string;
}

interface ReservationResult {
  reservationId: string;
  amount: number;
  reservationCode: string;
}

interface UseReservationCreationProps {
  onSuccess?: (data: ReservationResult) => void;
  onError?: (error: Error) => void;
}

export const useReservationCreation = ({
  onSuccess,
  onError
}: UseReservationCreationProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createReservation = useCallback(async (
    unitIds: string | string[],
    checkIn: Date,
    checkOut: Date,
    guests: number,
    totalPrice: number,
    paymentMethod: string = 'webpay',
    selectedActivities: string[] = [],
    selectedPackages: string[] = [],
    requiredDomos?: number,
    availableUnitIds?: string[],
    clientInfo?: ClientInfo
  ) => {
    setIsLoading(true);

    try {
      console.log('🚀 [useReservationCreation] Iniciando creación de reserva:', {
        unitIds,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
        totalPrice,
        requiredDomos
      });

      // Calcular domos necesarios
      const finalRequiredDomos = requiredDomos || Math.max(Math.ceil(guests / 4), 1);

      // Verificar y obtener unidades disponibles
      const unitsToReserve = await getAvailableUnits(
        unitIds,
        checkIn,
        checkOut,
        finalRequiredDomos,
        availableUnitIds
      );

      if (unitsToReserve.length < finalRequiredDomos) {
        const errorMessage = `Solo hay ${unitsToReserve.length} domos disponibles, se necesitan ${finalRequiredDomos}`;
        onError?.(new Error(errorMessage));
        return Promise.reject(new Error(errorMessage));
      }

      // Crear reservas usando transacción
      const reservations = await createReservationsTransaction(
        unitsToReserve.slice(0, finalRequiredDomos),
        checkIn,
        checkOut,
        guests,
        totalPrice,
        paymentMethod,
        selectedActivities,
        selectedPackages,
        clientInfo
      );

      const resultData = {
        reservationId: reservations[0].id,
        amount: totalPrice,
        reservationCode: reservations[0].reservation_code
      };

      toast({
        title: "Reserva iniciada",
        description: `Tu reserva de ${reservations.length} domo(s) se ha creado exitosamente`
      });

      onSuccess?.(resultData);
      return resultData;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear la reserva";
      console.error('❌ [useReservationCreation] Error:', errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast, onSuccess, onError]);

  return {
    createReservation,
    isLoading
  };
};

// Función para obtener unidades disponibles de manera segura
async function getAvailableUnits(
  unitIds: string | string[],
  checkIn: Date,
  checkOut: Date,
  requiredDomos: number,
  availableUnitIds?: string[]
): Promise<string[]> {
  
  // Si ya tenemos unidades pre-verificadas y suficientes
  if (availableUnitIds && availableUnitIds.length >= requiredDomos) {
    console.log('✅ Usando unidades pre-verificadas:', availableUnitIds.slice(0, requiredDomos));
    return availableUnitIds.slice(0, requiredDomos);
  }

  // Si se pasó un array de unitIds específicos
  if (Array.isArray(unitIds) && unitIds.length >= requiredDomos) {
    const verified = await verifyUnitsAvailability(unitIds, checkIn, checkOut);
    if (verified.length >= requiredDomos) {
      console.log('✅ Usando unitIds verificados:', verified.slice(0, requiredDomos));
      return verified.slice(0, requiredDomos);
    }
  }

  // Buscar unidades disponibles en la base de datos
  console.log('🔍 Buscando unidades disponibles en la base de datos...');
  
  const { data: allUnits, error: unitsError } = await supabase
    .from('glamping_units')
    .select('id')
    .order('id', { ascending: true });

  if (unitsError || !allUnits) {
    throw new Error('Error al obtener unidades disponibles');
  }

  const availableUnits = await verifyUnitsAvailability(
    allUnits.map(u => u.id), 
    checkIn, 
    checkOut
  );

  console.log(`✅ Unidades disponibles encontradas: ${availableUnits.length}`);
  return availableUnits;
}

// Función para verificar disponibilidad de unidades específicas
async function verifyUnitsAvailability(
  unitIds: string[],
  checkIn: Date,
  checkOut: Date
): Promise<string[]> {
  
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  
  const { data: conflictingReservations, error } = await supabase
    .from('reservations')
    .select('unit_id')
    .in('unit_id', unitIds)
    .or(`and(check_in.lt.${checkOut.toISOString()},check_out.gt.${checkIn.toISOString()})`)
    .or(`status.eq.confirmed,and(status.eq.pending,created_at.gte.${fifteenMinutesAgo})`);

  if (error) {
    throw new Error(`Error verificando disponibilidad: ${error.message}`);
  }

  const reservedUnitIds = new Set(
    conflictingReservations?.map(r => String(r.unit_id)) || []
  );

  return unitIds.filter(unitId => !reservedUnitIds.has(String(unitId)));
}

// Función para crear reservas usando transacción
async function createReservationsTransaction(
  unitIds: string[],
  checkIn: Date,
  checkOut: Date,
  totalGuests: number,
  totalPrice: number,
  paymentMethod: string,
  selectedActivities: string[],
  selectedPackages: string[],
  clientInfo?: ClientInfo
) {
  // Generar código de reserva único
  const reservationCode = generateReservationCode();
  
  // Distribuir huéspedes y precio entre domos
  const reservationsData = distributeGuestsAndPrice(
    unitIds,
    totalGuests,
    totalPrice,
    checkIn,
    checkOut,
    paymentMethod,
    selectedActivities,
    selectedPackages,
    reservationCode,
    clientInfo
  );

  // Insertar todas las reservas en una transacción
  const { data, error } = await supabase
    .from('reservations')
    .insert(reservationsData)
    .select();

  if (error) {
    throw new Error(`Error creando reservas: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('No se pudieron crear las reservas');
  }

  console.log(`✅ ${data.length} reservas creadas exitosamente con código: ${reservationCode}`);
  return data;
}

// Función para distribuir huéspedes y precio entre domos
function distributeGuestsAndPrice(
  unitIds: string[],
  totalGuests: number,
  totalPrice: number,
  checkIn: Date,
  checkOut: Date,
  paymentMethod: string,
  selectedActivities: string[],
  selectedPackages: string[],
  reservationCode: string,
  clientInfo?: ClientInfo
) {
  const reservations = [];
  let remainingGuests = totalGuests;
  let remainingPrice = totalPrice;

  for (let i = 0; i < unitIds.length; i++) {
    const isLastUnit = i === unitIds.length - 1;
    
    // Distribuir huéspedes
    const unitGuests = isLastUnit 
      ? remainingGuests 
      : Math.min(4, Math.ceil(remainingGuests / (unitIds.length - i)));
    
    // Distribuir precio proporcionalmente
    const unitPrice = isLastUnit 
      ? remainingPrice 
      : Math.round((unitGuests / totalGuests) * totalPrice);

    remainingGuests -= unitGuests;
    remainingPrice -= unitPrice;

    reservations.push({
      unit_id: unitIds[i],
      check_in: checkIn.toISOString(),
      check_out: checkOut.toISOString(),
      guests: unitGuests,
      total_price: unitPrice,
      status: 'pending' as const,
      payment_method: paymentMethod,
      selected_activities: selectedActivities,
      selected_packages: selectedPackages,
      reservation_code: reservationCode,
      client_name: clientInfo?.name,
      client_email: clientInfo?.email,
      client_phone: clientInfo?.phone,
      payment_details: {
        created_at: new Date().toISOString()
      }
    });
  }

  return reservations;
}

// Función para generar código de reserva único
function generateReservationCode(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${timestamp}${random}`.toUpperCase().substring(0, 8);
}
