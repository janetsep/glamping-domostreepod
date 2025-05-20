
import { useState } from 'react';
import { checkUnitAvailability, checkGeneralAvailability } from './utils/availabilityChecker';

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
      
      const result = await checkUnitAvailability(unitId, checkIn, checkOut);
      return result.isAvailable;
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

  /**
   * Verifica la disponibilidad general de domos (sin especificar una unidad concreta)
   */
  const checkGeneralDomosAvailability = async (
    checkIn: Date,
    checkOut: Date
  ) => {
    try {
      setIsLoading(true);
      
      return await checkGeneralAvailability(checkIn, checkOut);
    } catch (error) {
      console.error('Error al verificar disponibilidad general:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo verificar la disponibilidad. Por favor, intenta de nuevo.",
      });
      return {
        isAvailable: false,
        availableUnits: 0,
        totalUnits: 4
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verificar información detallada de disponibilidad
   */
  const checkDetailedAvailability = async (
    unitId: string,
    checkIn: Date,
    checkOut: Date
  ) => {
    try {
      setIsLoading(true);
      
      return await checkUnitAvailability(unitId, checkIn, checkOut);
    } catch (error) {
      console.error('Error al verificar disponibilidad detallada:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo verificar la disponibilidad. Por favor, intenta de nuevo.",
      });
      return {
        isAvailable: false,
        availableUnits: 0,
        totalUnits: 4
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    checkAvailability,
    checkGeneralDomosAvailability,
    checkDetailedAvailability
  };
};
