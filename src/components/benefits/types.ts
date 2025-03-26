
import { ReactNode } from "react";

export interface BenefitItem {
  icon: ReactNode;
  title: string;
  description: string;
  details: string;
  image?: string; // Mantener como opcional
}

export interface CategoryData {
  title: string;
  description: string;
  items: BenefitItem[];
}

export interface ExperiencesData {
  [key: string]: CategoryData;
}
