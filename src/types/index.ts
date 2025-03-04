export interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export interface ThemedPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  detailedDescription: string;
  activities?: Activity[];
}

export interface AvailabilityCalendarDay {
  date: Date;
  isAvailable: boolean;
  isSelected: boolean;
  availableUnits?: number;
  totalUnits?: number;
}
