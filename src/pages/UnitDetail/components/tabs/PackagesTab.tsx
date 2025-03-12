
import { ThemedPackagesSelector } from "@/components/unit-detail/ThemedPackagesSelector";
import { ThemedPackage } from "@/types";

interface PackagesTabProps {
  selectedPackages: ThemedPackage[];
  onPackageToggle: (pkg: ThemedPackage) => void;
  total: number;
}

export const PackagesTab = ({
  selectedPackages,
  onPackageToggle,
  total
}: PackagesTabProps) => {
  return (
    <ThemedPackagesSelector
      selectedPackages={selectedPackages}
      onPackageToggle={onPackageToggle}
      total={total}
    />
  );
};
