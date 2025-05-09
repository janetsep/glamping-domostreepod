
import { useState } from 'react';
import { checkUnitAvailability, checkGeneralAvailability } from './utils/availabilityChecker';
import { toast } from "sonner";

interface UseAvailabilityCheckProps {
  setIsLoading: (isLoading: boolean) => void;
  toast: any;
}

/**
 * Hook para verificar la disponibilidad de unidades para un rango de fechas específico
 */
export const useAvailabilityCheck = ({ setIsLoading, toast }: UseAvailabilityCheckProps) => {
  const checkAvailability = async (
    unitId: string,
    checkIn: Date,
    checkOut: Date
  ) => {
    try {
      setIsLoading(true);
      
      return await checkUnitAvailability(unitId, checkIn, checkOut);
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo verificar la disponibilidad. Por favor, intenta de nuevo.",
      });
      // En caso de error, asumimos que hay disponibilidad para no bloquear completamente la experiencia del usuario
      return true; 
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verifica la disponibilidad general de domos (sin especificar una unidad concreta)
   */
  const checkGeneralDomosAvailability = async (
    checkIn: Date,
    checkOut: Date
  ) => {
    try {
      setIsLoading(true);
      
      const result = await checkGeneralAvailability(checkIn, checkOut);
      console.log("Resultado de disponibilidad general:", result);
      return result;
    } catch (error) {
      console.error('Error al verificar disponibilidad general:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo verificar la disponibilidad. Por favor, intenta de nuevo.",
      });
      // En caso de error, retornamos disponibilidad total
      return {
        isAvailable: true,
        availableUnits: 4,
        totalUnits: 4
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    checkAvailability,
    checkGeneralDomosAvailability
  };
};
