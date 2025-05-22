
// src/pages/UnitDetail/hooks/useUnitDetailController.ts
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useUnitDetailController = () => {
  // Estados básicos
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(2); // Valor inicial por defecto
  const [availableDomos, setAvailableDomos] = useState<number>(4); // Iniciar con disponibilidad completa
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Calcular domos requeridos basado en el número de huéspedes
  const requiredDomos = Math.ceil(guests / 4);
  
  // Función para manejar cambios en el número de huéspedes
  const handleGuestsChange = (newGuests: number) => {
    console.log('Cambiando huéspedes de', guests, 'a', newGuests);
    setGuests(newGuests);
  };
  
  // Función para manejar cambios en la fecha de entrada
  const handleCheckInChange = (date: Date | null) => {
    setCheckInDate(date);
    // Si la fecha de salida es anterior o igual a la de entrada, ajustarla
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
    
    // Validar disponibilidad
    if (requiredDomos > availableDomos) {
      toast.error(`Solo hay ${availableDomos} de 4 domos disponibles. Necesitas ${requiredDomos} para ${guests} huéspedes.`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Aquí iría la lógica de reserva
      console.log('Procesando reserva:', {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        requiredDomos,
        availableDomos
      });
      
      toast.success('Verificando disponibilidad...');
      
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error en la reserva:', error);
      toast.error('Error al procesar la reserva');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función básica para confirmar la reserva
  const handleConfirmReservation = async () => {
    await handleReservation();
  };
  
  // Log para debugging
  useEffect(() => {
    console.log('Estado del controlador actualizado:', {
      guests,
      requiredDomos,
      availableDomos,
      checkInDate: checkInDate?.toISOString(),
      checkOutDate: checkOutDate?.toISOString()
    });
  }, [guests, requiredDomos, availableDomos, checkInDate, checkOutDate]);
  
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
    handleConfirmReservation,
    handleGuestsChange
  };
};