
import { useCallback } from 'react';
import { supabase, type GlampingUnit } from '@/lib/supabase';
import { packageData } from '@/components/packages/packageData';

interface UseGlampingUnitsProps {
  setIsLoading: (isLoading: boolean) => void;
  toast: any;
}

export const useGlampingUnits = ({ setIsLoading, toast }: UseGlampingUnitsProps) => {
  // Transform package data to glamping units
  const transformPackageToUnit = useCallback((packageItem: any): GlampingUnit => {
    return {
      id: packageItem.id,
      name: packageItem.title,
      description: packageItem.detailedDescription || packageItem.description,
      max_guests: packageItem.maxGuests || 4,
      prices: {
        base_price: packageItem.price
      },
      image_url: packageItem.image,
    };
  }, []);

  const fetchGlampingUnits = useCallback(async () => {
    try {
      console.log('Iniciando fetchGlampingUnits');
      setIsLoading(true);
      const { data, error } = await supabase
        .from('glamping_units')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error en la consulta:', error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log('Unidades encontradas:', data.length);
        return data as GlampingUnit[];
      }

      console.log('No se encontraron unidades, usando datos de packageData');
      // Fallback to packageData
      return packageData.map(transformPackageToUnit);
    } catch (error) {
      console.error('Error en fetchGlampingUnits:', error);
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudieron cargar las unidades. Por favor, intenta de nuevo más tarde.",
      });
      // Fallback to packageData
      return packageData.map(transformPackageToUnit);
    } finally {
      setIsLoading(false);
    }
  }, [toast, transformPackageToUnit, setIsLoading]);
  
  const fetchGlampingUnit = useCallback(async (unitId: string) => {
    try {
      setIsLoading(true);
      const units = await fetchGlampingUnits();
      return units.find(unit => unit.id === unitId);
    } catch (error) {
      console.error('Error fetching glamping unit:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchGlampingUnits, setIsLoading]);

  return { 
    fetchGlampingUnits,
    fetchGlampingUnit
  };
};
