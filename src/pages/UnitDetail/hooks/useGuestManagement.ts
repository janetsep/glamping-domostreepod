
import { useState, useEffect } from "react";

export const useGuestManagement = (availableDomos: number) => {
  const [guests, setGuests] = useState(2);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Efecto para ajustar automáticamente los huéspedes cuando cambie availableDomos
  useEffect(() => {
    // Solo ejecutar si availableDomos está definido y huéspedes > 0
    if (availableDomos === undefined || guests === 0) {
      return;
    }

    const maxGuestsAllowed = availableDomos * 4;
    
    console.log('🔄 [useGuestManagement] Verificando necesidad de ajuste de huéspedes:', {
      domosDisponibles: availableDomos,
      máximoHuéspedes: maxGuestsAllowed,
      huéspedesActuales: guests,
      necesitaAjuste: guests > maxGuestsAllowed
    });
    
    // SOLO ajustar si los huéspedes actuales EXCEDEN la capacidad máxima
    if (guests > maxGuestsAllowed) {
      console.log('🔄 [useGuestManagement] Ajustando huéspedes porque exceden capacidad:', {
        huéspedesAntes: guests,
        máximoPermitido: maxGuestsAllowed,
        domosDisponibles: availableDomos
      });
      
      if (availableDomos === 0) {
        // Solo si no hay domos disponibles, resetear
        setGuests(0);
        setAdults(0);
        setChildren(0);
      } else {
        // Ajustar al máximo permitido
        setGuests(maxGuestsAllowed);
        
        // Distribuir proporcionalmente pero asegurar al menos 1 adulto
        const newAdults = Math.max(1, Math.min(adults, maxGuestsAllowed));
        const newChildren = Math.max(0, maxGuestsAllowed - newAdults);
        
        setAdults(newAdults);
        setChildren(newChildren);
      }
    }
  }, [availableDomos]); // Solo depende de availableDomos

  return {
    guests,
    adults,
    children,
    setGuests,
    setAdults,
    setChildren
  };
};
