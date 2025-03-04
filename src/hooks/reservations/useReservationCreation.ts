import { useCallback } from 'react';
import { packageData } from '@/components/packages/packageData';
import { supabase } from '@/lib/supabase';

const SUPABASE_URL = 'https://gtxjfmvnzrsuaxryffnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8';

import { checkUnitAvailability } from './utils/availabilityChecker';

interface UseReservationCreationProps {
  setIsLoading: (isLoading: boolean) => void;
  toast: any;
  checkAvailability: (unitId: string, checkIn: Date, checkOut: Date) => Promise<boolean>;
}

export const useReservationCreation = ({ 
  setIsLoading, 
  toast,
  checkAvailability 
}: UseReservationCreationProps) => {
  const createReservation = useCallback(async (
    unitId: string,
    checkIn: Date,
    checkOut: Date,
    guests: number,
    totalPrice: number,
    paymentMethod: string = 'webpay',
    selectedActivities: string[] = [],
    selectedPackages: string[] = []
  ) => {
    setIsLoading(true);
    try {
      const isAvailable = await checkAvailability(unitId, checkIn, checkOut);
      if (!isAvailable) {
        toast({
          variant: "destructive",
          title: "No disponible",
          description: "Lo sentimos, las fechas seleccionadas no están disponibles.",
        });
        return null;
      }

      // Check if this is a packageData unit or a real database unit
      const isPackageUnit = packageData.some(pkg => pkg.id === unitId);
      let reservationData;
      
      if (isPackageUnit) {
        // Para package units, crear un objeto temporal
        console.log('Creando reserva temporal para unidad de paquete');
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        reservationData = {
          id: tempId,
          created_at: new Date().toISOString(),
          unit_id: unitId,
          check_in: checkIn.toISOString(),
          check_out: checkOut.toISOString(),
          guests: guests,
          total_price: totalPrice,
          status: 'pending',
          payment_method: paymentMethod,
          is_package_unit: true,
          selected_activities: selectedActivities,
          selected_packages: selectedPackages,
          payment_details: {
            created_at: new Date().toISOString()
          }
        };
      } else {
        // Para unidades reales, crear la reserva en la base de datos
        console.log('Creando reserva en la base de datos');
        console.log('Datos de reserva:', {
          unit_id: unitId,
          check_in: checkIn.toISOString(),
          check_out: checkOut.toISOString(),
          guests,
          total_price: totalPrice,
          status: 'pending',
          payment_method: paymentMethod,
          selected_activities: selectedActivities,
          selected_packages: selectedPackages
        });
        
        // Primero intentamos con la API del cliente Supabase
        try {
          const { data, error } = await supabase
            .from('reservations')
            .insert({
              unit_id: unitId,
              check_in: checkIn.toISOString(),
              check_out: checkOut.toISOString(),
              guests,
              total_price: totalPrice,
              status: 'pending',
              payment_method: paymentMethod,
              selected_activities: selectedActivities,
              selected_packages: selectedPackages,
              payment_details: {
                created_at: new Date().toISOString()
              }
            })
            .select()
            .single();
          
          if (error) {
            console.error('Error con cliente Supabase:', error);
            throw error;
          }
          
          reservationData = data;
          console.log('Reserva creada con cliente Supabase:', reservationData);
        } catch (supabaseError) {
          // Si falla, intentamos con fetch directo a la API REST
          console.log('Intentando crear reserva con fetch directo');
          const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              unit_id: unitId,
              check_in: checkIn.toISOString(),
              check_out: checkOut.toISOString(),
              guests,
              total_price: totalPrice,
              status: 'pending',
              payment_method: paymentMethod,
              selected_activities: selectedActivities,
              selected_packages: selectedPackages,
              payment_details: {
                created_at: new Date().toISOString()
              }
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error al crear reserva con fetch:', errorText);
            throw new Error(`Error al crear reserva: ${response.status} ${errorText}`);
          }

          const data = await response.json();
          reservationData = data[0];
          console.log('Reserva creada con fetch directo:', reservationData);
        }
      }
      
      toast({
        title: "Reserva iniciada",
        description: "Tu reserva se ha creado y ahora serás redirigido a Webpay para completar el pago",
      });

      return reservationData;
    } catch (error) {
      console.error('Error al crear reserva:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la reserva. Por favor, inténtalo de nuevo.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [checkAvailability, setIsLoading, toast]);

  return { createReservation };
};
