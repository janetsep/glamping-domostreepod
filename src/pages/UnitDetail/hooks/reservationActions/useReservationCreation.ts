
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { ReservationState } from '@/pages/UnitDetail/hooks/types';

export const useReservationCreation = (state: ReservationState) => {
  const handleConfirmReservation = async () => {
    if (!state.displayUnit || !state.startDate || !state.endDate || !state.quote) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      console.log('🔍 [handleConfirmReservation] Iniciando proceso de reserva');
      
      const requiredDomos = Math.ceil(state.guests / 4);
      console.log('📊 [handleConfirmReservation] Usando disponibilidad ya verificada:', {
        huéspedes: state.guests,
        domosRequeridos: requiredDomos,
        domosDisponibles: state.availableDomos,
        fechas: {
          checkIn: state.startDate.toISOString(),
          checkOut: state.endDate.toISOString()
        }
      });

      // En lugar de verificar disponibilidad nuevamente, usar los datos ya validados
      if (state.availableDomos !== undefined && state.availableDomos < requiredDomos) {
        console.error('❌ [handleConfirmReservation] No hay suficientes domos según verificación previa:', {
          disponibles: state.availableDomos,
          requeridos: requiredDomos
        });
        toast.error(`No hay suficientes domos disponibles. Se necesitan ${requiredDomos} domos, pero solo hay ${state.availableDomos} disponibles.`);
        return;
      }

      // Obtener unidades disponibles usando la misma lógica que se usó para la verificación inicial
      const { data: units, error: unitsError } = await supabase
        .from('glamping_units')
        .select('id, max_guests')
        .order('id', { ascending: true }); // Orden consistente

      if (unitsError) {
        console.error('❌ [handleConfirmReservation] Error al obtener unidades:', unitsError);
        throw unitsError;
      }

      // Obtener reservas solapadas con la misma lógica que la verificación inicial
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('unit_id, check_in, check_out, status')
        .in('unit_id', units.map(u => u.id))
        .or(`and(check_in.lt.${state.endDate.toISOString()},check_out.gt.${state.startDate.toISOString()})`)
        .eq('status', 'confirmed');

      if (reservationsError) {
        console.error('❌ [handleConfirmReservation] Error al obtener reservas:', reservationsError);
        throw reservationsError;
      }

      // Usar la misma lógica de filtrado que en la verificación inicial
      const reservedUnitIds = new Set(
        reservations
          ?.filter(r => r.unit_id !== null && r.unit_id !== undefined)
          .map(r => String(r.unit_id)) || []
      );

      const availableUnitIds = units
        .map(u => u.id)
        .filter(id => !reservedUnitIds.has(String(id)));

      console.log('📊 [handleConfirmReservation] Verificación final de disponibilidad:', {
        totalUnidades: units.length,
        unidadesReservadas: reservedUnitIds.size,
        unidadesDisponibles: availableUnitIds.length,
        unidadesReservadasIds: Array.from(reservedUnitIds),
        unidadesDisponiblesIds: availableUnitIds,
        requiredDomos
      });

      // Verificación adicional por seguridad
      if (availableUnitIds.length < requiredDomos) {
        console.error('❌ [handleConfirmReservation] Discrepancia en disponibilidad final:', {
          disponiblesAhora: availableUnitIds.length,
          disponiblesAntes: state.availableDomos,
          requeridos: requiredDomos
        });
        toast.error(`Error de sincronización. Por favor, verifica nuevamente la disponibilidad. Disponibles ahora: ${availableUnitIds.length}, requeridos: ${requiredDomos}`);
        return;
      }

      // Seleccionar las unidades necesarias en orden consistente
      const selectedUnitIds = availableUnitIds.slice(0, requiredDomos);
      console.log('✅ [handleConfirmReservation] Unidades seleccionadas para reserva:', {
        unidades: selectedUnitIds,
        requiredDomos,
        totalGuests: state.guests
      });

      state.setIsProcessingPayment(true);
      toast.dismiss();
      
      const activityIds = state.selectedActivities.map(a => a.id);
      const packageIds = state.selectedPackages.map(p => p.id);

      // Crear las reservas con la información del cliente
      console.log('🚀 [handleConfirmReservation] Creando reserva con datos:', {
        unidades: selectedUnitIds,
        checkIn: state.startDate.toISOString(),
        checkOut: state.endDate.toISOString(),
        guests: state.guests,
        totalPrice: state.quote.totalPrice,
        clientInfo: {
          name: localStorage.getItem('client_name'),
          email: localStorage.getItem('client_email'),
          phone: localStorage.getItem('client_phone')
        }
      });

      const reservation = await state.createReservation(
        selectedUnitIds,
        state.startDate,
        state.endDate,
        state.guests,
        state.quote.totalPrice,
        'webpay',
        activityIds,
        packageIds,
        requiredDomos,
        availableUnitIds,
        {
          name: localStorage.getItem('client_name') || undefined,
          email: localStorage.getItem('client_email') || undefined,
          phone: localStorage.getItem('client_phone') || undefined
        }
      );
      
      if (reservation) {
        console.log('✅ [handleConfirmReservation] Reserva creada exitosamente:', reservation);
        state.redirectToWebpay(reservation.reservationId, state.quote.totalPrice);
        state.refetchAvailability();
      } else {
        throw new Error('No se pudo crear la reserva');
      }
    } catch (error) {
      console.error('❌ [handleConfirmReservation] Error general:', error);
      toast.error('Error al procesar la reserva. Por favor, intenta nuevamente.');
    } finally {
      state.setIsProcessingPayment(false);
    }
  };

  return {
    handleConfirmReservation
  };
};
