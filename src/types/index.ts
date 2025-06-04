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

export interface Reservation {
  id: string;
  user_id?: string;
  unit_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  adults: number;
  children: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_method?: string;
  created_at: string;
  updated_at: string;
  reservation_code?: string;
  payment_status?: string;
  webpay_token?: string;
  required_domes: number;
  selected_activities?: Activity[];
  selected_packages?: ThemedPackage[];
  client_info?: any;
}
