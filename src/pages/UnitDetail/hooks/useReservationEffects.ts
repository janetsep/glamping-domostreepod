
import { useEffect } from "react";

interface UseReservationEffectsProps {
  guests: number;
  setRequiredDomos: (domos: number) => void;
  selectedActivities: any[];
  selectedPackages: any[];
  setActivitiesTotal: (total: number) => void;
  setPackagesTotal: (total: number) => void;
  isReservationConfirmed: boolean;
  confirmationRef: React.RefObject<HTMLDivElement>;
}

export const useReservationEffects = ({
  guests,
  setRequiredDomos,
  selectedActivities,
  selectedPackages,
  setActivitiesTotal,
  setPackagesTotal,
  isReservationConfirmed,
  confirmationRef
}: UseReservationEffectsProps) => {
  // Calculate required domos based on guests
  useEffect(() => {
    const MAX_GUESTS_PER_DOMO = 4;
    const domos = Math.ceil(guests / MAX_GUESTS_PER_DOMO);
    setRequiredDomos(domos);
  }, [guests, setRequiredDomos]);

  // Calculate activity and package totals
  useEffect(() => {
    let actTotal = 0;
    let pkgTotal = 0;

    selectedActivities.forEach((activity) => {
      actTotal += activity.price;
    });

    selectedPackages.forEach((pkg) => {
      pkgTotal += pkg.price;
    });

    setActivitiesTotal(actTotal);
    setPackagesTotal(pkgTotal);
  }, [selectedActivities, selectedPackages, setActivitiesTotal, setPackagesTotal]);

  // Initial scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to confirmation section when confirmed
  useEffect(() => {
    if (isReservationConfirmed && confirmationRef.current) {
      confirmationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isReservationConfirmed, confirmationRef]);
};
