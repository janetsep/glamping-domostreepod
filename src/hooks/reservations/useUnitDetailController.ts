// src/hooks/reservations/useUnitDetailController.ts
import { useState, useEffect } from 'react';

// Función simple de toast como reemplazo temporal (eliminada la dependencia de react-toastify)
const toast = {
  error: (message: string) => {
    console.error('Toast Error:', message);
    alert(`Error: ${message}`); // Reemplazar con tu sistema de notificaciones
  },
  success: (message: string) => {
    console.log('Toast Success:', message);
    alert(`Éxito: ${message}`); // Reemplazar con tu sistema de notificaciones
  },
  warning: (message: string, options?: any) => {
    console.warn('Toast Warning:', message);
    alert(`Advertencia: ${message}`); // Reemplazar con tu sistema de notificaciones
  }
};

export const useUnitDetailController = () => {
  // Estados básicos
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(2);
  const [availableDomos, setAvailableDomos] = useState<number>(4);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Calcular domos requeridos basado en el número de huéspedes
  const requiredDomos = Math.ceil(guests / 4);
  
  // 🐛 DEBUG: Función de cambio de huéspedes con logs
  const handleGuestsChange = (newGuests: number) => {
    console.log('🔍 useUnitDetailController: handleGuestsChange llamado:', {
      currentGuests: guests,
      newGuests,
      typeof_newGuests: typeof newGuests
    });
    
    setGuests(newGuests);
    
    // 🐛 DEBUG: Verificar cambio después de un tick
    setTimeout(() => {
      console.log('🔍 useUnitDetailController: Estado después del cambio:', guests);
    }, 100);
  };
  
  // Función para manejar cambios en la fecha de entrada
  const handleCheckInChange = (date: Date | null) => {
    setCheckInDate(date);
    if (date && checkOutDate && date >= checkOutDate) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOutDate(nextDay);
    }
  };
  
  // Función para manejar cambios en la fecha de salida
  const handleCheckOutChange = (date: Date | null) => {
    setCheckOutDate(date);
  };
  
  // Función básica para manejar la reserva
  const handleReservation = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error('Por favor selecciona las fechas de entrada y salida');
      return;
    }
    
    if (guests < 1) {
      toast.error('Por favor selecciona el número de huéspedes');
      return;
    }
    
    if (requiredDomos > availableDomos) {
      toast.error(`Solo hay ${availableDomos} de 4 domos disponibles. Necesitas ${requiredDomos} para ${guests} huéspedes.`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Procesando reserva:', {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        requiredDomos,
        availableDomos
      });
      
      toast.success('Verificando disponibilidad...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error en la reserva:', error);
      toast.error('Error al procesar la reserva');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 🐛 DEBUG: useEffect para monitorear cambios en guests
  useEffect(() => {
    console.log('🔍 useUnitDetailController: guests cambió a:', guests);
  }, [guests]);

  // 🐛 DEBUG: Log general del estado en cada render
  console.log('🔍 useUnitDetailController render con estado:', {
    guests,
    requiredDomos,
    handleGuestsChange: typeof handleGuestsChange
  });
  
  // Retornar todos los valores y funciones necesarios
  return {
    // Estados
    checkInDate,
    checkOutDate,
    guests,
    requiredDomos,
    availableDomos,
    isLoading,
    
    // Setters
    setCheckInDate: handleCheckInChange,
    setCheckOutDate: handleCheckOutChange,
    setGuests: handleGuestsChange,
    setAvailableDomos,
    
    // Funciones
    handleReservation,
    handleConfirmReservation: handleReservation,
    handleGuestsChange
  };
};
