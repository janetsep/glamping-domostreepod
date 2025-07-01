
import { useState, useEffect } from "react";

/**
 * Hook optimizado para gestión de huéspedes
 * Ajusta automáticamente el número de huéspedes según la disponibilidad
 */
export const useGuestManagement = (availableDomos?: number) => {
  const [guests, setGuests] = useState(2);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Ajustar automáticamente el número de huéspedes si excede la capacidad disponible
  useEffect(() => {
    if (availableDomos !== undefined && availableDomos > 0) {
      const maxCapacity = availableDomos * 4;
      
      if (guests > maxCapacity) {
        console.log(`🔧 [useGuestManagement] Ajustando huéspedes de ${guests} a ${maxCapacity} por capacidad disponible`);
        setGuests(maxCapacity);
        
        // Redistribuir adultos y niños proporcionalmente
        const adultRatio = adults / guests;
        const newAdults = Math.max(1, Math.floor(maxCapacity * adultRatio));
        const newChildren = maxCapacity - newAdults;
        
        setAdults(newAdults);
        setChildren(Math.max(0, newChildren));
      }
    }
  }, [availableDomos, guests, adults]);

  // Validar que adults + children = guests
  useEffect(() => {
    const totalGuests = adults + children;
    if (totalGuests !== guests) {
      setGuests(totalGuests);
    }
  }, [adults, children]);

  const handleGuestsChange = (newGuests: number) => {
    console.log('🔍 [useGuestManagement] Cambiando huéspedes:', { current: guests, new: newGuests });
    
    // Verificar límite de capacidad
    if (availableDomos !== undefined && availableDomos > 0) {
      const maxCapacity = availableDomos * 4;
      if (newGuests > maxCapacity) {
        console.log(`⚠️ [useGuestManagement] Límite de capacidad alcanzado: ${maxCapacity}`);
        return;
      }
    }

    setGuests(newGuests);
    
    // Ajustar adultos y niños manteniendo proporciones
    if (newGuests > 0) {
      const adultRatio = adults / Math.max(guests, 1);
      const newAdults = Math.max(1, Math.min(newGuests, Math.round(newGuests * adultRatio)));
      const newChildren = Math.max(0, newGuests - newAdults);
      
      setAdults(newAdults);
      setChildren(newChildren);
    }
  };

  const handleAdultsChange = (newAdults: number) => {
    const maxAdults = Math.max(1, guests - children);
    const validAdults = Math.min(Math.max(1, newAdults), maxAdults);
    
    setAdults(validAdults);
    setChildren(guests - validAdults);
  };

  const handleChildrenChange = (newChildren: number) => {
    const maxChildren = Math.max(0, guests - 1); // Al menos 1 adulto
    const validChildren = Math.min(Math.max(0, newChildren), maxChildren);
    
    setChildren(validChildren);
    setAdults(guests - validChildren);
  };

  return {
    guests,
    adults,
    children,
    setGuests: handleGuestsChange,
    setAdults: handleAdultsChange,
    setChildren: handleChildrenChange,
    maxCapacity: availableDomos ? availableDomos * 4 : undefined
  };
};
