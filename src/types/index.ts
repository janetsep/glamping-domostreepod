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
