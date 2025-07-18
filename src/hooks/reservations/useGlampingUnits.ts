
import { useQuery } from '@tanstack/react-query';
import { supabase, type GlampingUnit } from '@/lib/supabase';
import { packageData } from '@/components/packages/packageData';

export const useGlampingUnits = () => {
  return useQuery({
    queryKey: ['glamping-units'],
    queryFn: async (): Promise<GlampingUnit[]> => {
      try {
        console.log('Fetching glamping units from Supabase...');
        const { data, error } = await supabase
          .from('glamping_units')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching units:', error);
          throw error;
        }

        // Combine database units with package units
        const dbUnits = data || [];
        const packageUnits = packageData.map((packageItem): GlampingUnit => ({
          id: packageItem.id,
          name: packageItem.title,
          description: packageItem.detailedDescription || packageItem.description,
          max_guests: packageItem.maxGuests || 4,
          prices: {
            base_price: packageItem.price
          },
          image_url: packageItem.image,
        }));

        const allUnits = [...dbUnits, ...packageUnits];
        console.log('Total units found:', allUnits.length);
        return allUnits;
      } catch (error) {
        console.error('Error in useGlampingUnits:', error);
        // Return package data on error
        return packageData.map((packageItem): GlampingUnit => ({
          id: packageItem.id,
          name: packageItem.title,
          description: packageItem.detailedDescription || packageItem.description,
          max_guests: packageItem.maxGuests || 4,
          prices: {
            base_price: packageItem.price
          },
          image_url: packageItem.image,
        }));
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (reemplaza cacheTime)
  });
};
