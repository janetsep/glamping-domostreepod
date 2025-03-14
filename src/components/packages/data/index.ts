
import { PackageItem } from "../PackageCard";
import { individualPackages } from "./individualPackages";
import { couplePackages } from "./couplePackages";
import { adventurePackages } from "./adventurePackages";
import { specialtyPackages } from "./specialtyPackages";

// Combine all packages into a single array
export const packageData: PackageItem[] = [
  ...individualPackages,
  ...couplePackages,
  ...adventurePackages,
  ...specialtyPackages
];

// Re-export the createIcon utility
export { createIcon } from "./utils";
