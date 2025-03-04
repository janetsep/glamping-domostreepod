
export type Activity = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
};

export type ThemedPackage = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
};

export type AvailabilityCalendarDay = {
  date: Date;
  isAvailable: boolean;
  isSelected?: boolean;
};
