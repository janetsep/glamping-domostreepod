
import { supabase } from '@/lib/supabase';

/**
 * Calculates the total price of selected activities
 */
export const calculateActivitiesTotal = async (selectedActivities: string[]) => {
  if (!selectedActivities.length) return 0;
  
  try {
    const { data: activities } = await supabase
      .from('activities')
      .select('price')
      .in('id', selectedActivities);
    
    if (activities) {
      return activities.reduce((sum, act) => sum + act.price, 0);
    }
    return 0;
  } catch (error) {
    console.error('Error calculating activities total:', error);
    return 0;
  }
};

/**
 * Calculates the total price of selected packages
 */
export const calculatePackagesTotal = async (selectedPackages: string[]) => {
  if (!selectedPackages.length) return 0;
  
  try {
    const { data: packages } = await supabase
      .from('themed_packages')
      .select('price')
      .in('id', selectedPackages);
    
    if (packages) {
      return packages.reduce((sum, pkg) => sum + pkg.price, 0);
    }
    return 0;
  } catch (error) {
    console.error('Error calculating packages total:', error);
    return 0;
  }
};

/**
 * Calculates the final total price including base price, activities, and packages
 */
export const calculateFinalTotal = (basePrice: number, activitiesTotal: number, packagesTotal: number) => {
  const finalTotal = basePrice + activitiesTotal + packagesTotal;
  
  console.log('Price breakdown:', {
    basePrice,
    activitiesTotal,
    packagesTotal,
    finalTotal
  });
  
  return finalTotal;
};
