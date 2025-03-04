export interface AvailabilityCalendarDay {
  date: Date;
  isAvailable: boolean;
  isSelected: boolean;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: string;
  image_url?: string;
}

export interface ThemedPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  items?: string[];
  image_url?: string;
}
