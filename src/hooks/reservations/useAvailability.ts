
import { packageData } from '@/components/packages/packageData';
import { supabase } from '@/lib/supabase';

interface UseAvailabilityProps {
  setIsLoading: (isLoading: boolean) => void;
  toast: any;
}

export const useAvailability = ({ setIsLoading, toast }: UseAvailabilityProps) => {
  const checkAvailability = async (
    unitId: string,
    checkIn: Date,
    checkOut: Date
  ) => {
    try {
      setIsLoading(true);
      console.log(`Verificando disponibilidad para unidad ${unitId} del ${checkIn.toISOString()} al ${checkOut.toISOString()}`);
      
      // First check if this is a package unit (not in database)
      const isPackageUnit = packageData.some(pkg => pkg.id === unitId);
      if (isPackageUnit) {
        // For package units, we assume they're always available
        console.log('Unidad de paquete, asumiendo disponibilidad');
        return true;
      }
      
      // Buscamos reservaciones que se solapan con las fechas solicitadas
      // Un solapamiento ocurre cuando:
      // - La fecha de check-in solicitada está entre la entrada y salida de una reserva existente
      // - La fecha de check-out solicitada está entre la entrada y salida de una reserva existente
      // - El período solicitado engloba completamente una reserva existente
      
      const { data: existingReservations, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('unit_id', unitId)
        .eq('status', 'confirmed')
        .or(`check_in.lte.${checkOut.toISOString()},check_out.gte.${checkIn.toISOString()}`);

      if (error) {
        console.error('Error al verificar disponibilidad:', error);
        throw error;
      }

      console.log('Reservaciones encontradas:', existingReservations?.length || 0);
      if (existingReservations && existingReservations.length > 0) {
        console.log('Detalles de reservaciones encontradas:', JSON.stringify(existingReservations));
      }
      return existingReservations?.length === 0; // Return true if no overlapping reservations
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo verificar la disponibilidad. Por favor, intenta de nuevo.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { checkAvailability };
};
