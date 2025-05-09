
import { ThemedPackage } from '@/types';

interface PackageSelectorProps {
  packages: ThemedPackage[];
  selectedPackages: ThemedPackage[];
  onPackageToggle: (pkg: ThemedPackage) => void;
}

const PackageSelector = ({ packages, selectedPackages, onPackageToggle }: PackageSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Paquetes temáticos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packages.map((pkg) => {
          const isSelected = selectedPackages.some((p) => p.id === pkg.id);
          return (
            <div key={pkg.id} className="flex items-start space-x-3">
              <input
                type="checkbox"
                id={`package-${pkg.id}`}
                checked={isSelected}
                onChange={() => onPackageToggle(pkg)}
                className="mt-1"
              />
              <label htmlFor={`package-${pkg.id}`} className="flex-1 cursor-pointer">
                <div className="font-medium">{pkg.name}</div>
                <div className="text-sm text-gray-500">{pkg.description}</div>
                <div className="text-sm font-medium mt-1">${pkg.price.toLocaleString()}</div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PackageSelector;
