
export interface Activity {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  duration?: string;
  category?: string;
  image_url?: string;
}

export interface ThemedPackage {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  duration?: string;
  includes?: string[];
  image_url?: string;
}

export interface AvailabilityCalendarDay {
  date: Date;
  isAvailable: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  price?: number;
  reservedDomos?: number;
  totalDomos?: number;
  availableUnits?: number;
  totalUnits?: number;
}

export interface Feature {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface Policy {
  id: string;
  title: string;
  description: string;
  icon?: string;
}
