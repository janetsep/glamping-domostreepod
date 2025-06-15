
import { useState } from "react";
import { Activity, ThemedPackage } from "@/types";

export const useExtrasState = () => {
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<ThemedPackage[]>([]);
  const [activitiesTotal, setActivitiesTotal] = useState(0);
  const [packagesTotal, setPackagesTotal] = useState(0);

  return {
    selectedActivities,
    selectedPackages,
    activitiesTotal,
    packagesTotal,
    setSelectedActivities,
    setSelectedPackages
  };
};
