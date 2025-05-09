
import { useCallback } from 'react';
import { Activity, ThemedPackage } from '@/types';
import { ReservationState } from './types';

/**
 * Hook for managing extras (activities and packages)
 */
export const useExtrasManagement = (state: ReservationState) => {
  const handleActivityToggle = useCallback((activity: Activity) => {
    const isSelected = state.selectedActivities.some((a) => a.id === activity.id);

    let newActivities = [...state.selectedActivities];
    if (isSelected) {
      newActivities = newActivities.filter((a) => a.id !== activity.id);
    } else {
      newActivities = [...newActivities, activity];
    }

    state.setSelectedActivities(newActivities);

    // Calculate the new total
    const newTotal = newActivities.reduce((acc, a) => acc + a.price, 0);
    state.setActivitiesTotal(newTotal);
  }, [state]);

  const handlePackageToggle = useCallback((pkg: ThemedPackage) => {
    const isSelected = state.selectedPackages.some((p) => p.id === pkg.id);

    let newPackages = [...state.selectedPackages];
    if (isSelected) {
      newPackages = newPackages.filter((p) => p.id !== pkg.id);
    } else {
      newPackages = [...newPackages, pkg];
    }

    state.setSelectedPackages(newPackages);

    // Calculate the new total
    const newTotal = newPackages.reduce((acc, p) => acc + p.price, 0);
    state.setPackagesTotal(newTotal);
  }, [state]);

  const getUpdatedQuoteTotal = useCallback(() => {
    let baseTotal = state.quote?.totalPrice || 0;
    const activitiesTotal = state.activitiesTotal || 0;
    const packagesTotal = state.packagesTotal || 0;

    return baseTotal + activitiesTotal + packagesTotal;
  }, [state]);

  return {
    handleActivityToggle,
    handlePackageToggle,
    getUpdatedQuoteTotal
  };
};
