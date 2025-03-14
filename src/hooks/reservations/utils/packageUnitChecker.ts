
import { packageData } from '@/components/packages/data';

/**
 * Checks if a unit is a package unit
 */
export const isPackageUnit = (unitId: string) => {
  return packageData.some(pkg => pkg.id === unitId);
};
