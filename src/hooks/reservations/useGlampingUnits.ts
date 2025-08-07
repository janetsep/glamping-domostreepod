
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
        // Normalize DB units to match GlampingUnit type
        const normalizedDbUnits: GlampingUnit[] = dbUnits.map((u: any) => {
          const prices = typeof u.prices === 'object' && u.prices !== null
            ? u.prices
            : { base_price: u.base_price || 0, weekend_price: u.weekend_price, holiday_price: u.holiday_price };
          return {
            id: u.id,
            name: u.name,
            description: u.description,
            max_guests: u.max_guests ?? 4,
            prices,
            image_url: u.image_url,
            available_activities: u.available_activities,
            available_services: u.available_services,
            created_at: u.created_at,
            pet_price: u.pet_price,
            max_pets: u.max_pets,
            images: u.images,
            features: u.features,
          } as GlampingUnit;
        });

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

        const allUnits = [...normalizedDbUnits, ...packageUnits];
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
