
import { useState } from "react";
import { Activity, ThemedPackage } from "@/types";

export const useQuoteState = () => {
  const [quote, setQuote] = useState<any>(null);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<ThemedPackage[]>([]);
  const [activitiesTotal, setActivitiesTotal] = useState(0);
  const [packagesTotal, setPackagesTotal] = useState(0);

  return {
    quote,
    setQuote,
    selectedActivities,
    setSelectedActivities,
    selectedPackages,
    setSelectedPackages,
    activitiesTotal,
    setActivitiesTotal,
    packagesTotal,
    setPackagesTotal
  };
};
