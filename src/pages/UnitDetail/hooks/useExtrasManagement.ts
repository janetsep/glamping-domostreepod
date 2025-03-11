
import { Activity, ThemedPackage } from "@/types";
import { UnitDetailState } from "./useUnitDetailState";

export const useExtrasManagement = (state: UnitDetailState) => {
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
