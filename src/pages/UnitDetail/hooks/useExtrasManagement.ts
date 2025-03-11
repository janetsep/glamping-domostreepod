
import { Activity, ThemedPackage } from "@/types";

type ExtrasManagementState = {
  setSelectedActivities: (
    value: Activity[] | ((prev: Activity[]) => Activity[])
  ) => void;
  setSelectedPackages: (
    value: ThemedPackage[] | ((prev: ThemedPackage[]) => ThemedPackage[])
  ) => void;
};

export const useExtrasManagement = (state: ExtrasManagementState) => {
  const handleActivityToggle = (activity: Activity) => {
    state.setSelectedActivities((prev: Activity[]) => {
      const isSelected = prev.some((a) => a.id === activity.id);
      if (isSelected) {
        return prev.filter((a) => a.id !== activity.id);
      } else {
        return [...prev, activity];
      }
    });
  };

  const handlePackageToggle = (pkg: ThemedPackage) => {
    state.setSelectedPackages((prev: ThemedPackage[]) => {
      const isSelected = prev.some((p) => p.id === pkg.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== pkg.id);
      } else {
        return [...prev, pkg];
      }
    });
  };

  return {
    handleActivityToggle,
    handlePackageToggle,
  };
};
