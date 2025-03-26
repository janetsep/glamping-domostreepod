
import { ReactNode } from "react";

export interface BenefitItem {
  icon: ReactNode;
  title: string;
  description: string;
  details: string;
  image?: string; // Make image optional with the ? modifier
}

export interface CategoryData {
  title: string;
  description: string;
  items: BenefitItem[];
}

export interface ExperiencesData {
  [key: string]: CategoryData;
}
