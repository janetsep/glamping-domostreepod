
import { supabase as supabaseClient } from '@/integrations/supabase/client';

export const supabase = supabaseClient;

export type Reservation = {
  id: string;
  created_at: string;
  user_id?: string;
  unit_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_method?: string;
  is_package_unit?: boolean;
};

export type GlampingUnit = {
  id: string;
  name: string;
  description: string;
  max_guests: number;
  bedrooms?: number;
  bathrooms?: number;
  prices: {
    base_price: number;
    weekend_price?: number;
    holiday_price?: number;
  };
  base_price?: number;
  weekend_price?: number;
  holiday_price?: number;
  image_url: string;
  images?: string[];
  features?: string[];
  created_at?: string;
  pet_price?: number;
  max_pets?: number;
  available_activities?: any[];
  available_services?: any[];
};

// Función helper para obtener las imágenes de un domo con imágenes por defecto
export const getUnitImages = (unit: GlampingUnit): string[] => {
  // Si el domo tiene imágenes específicas, las usamos
  if (unit.images && unit.images.length > 0) {
    return unit.images;
  }
  
  // Si no, usamos un conjunto de imágenes por defecto basadas en el ID de la unidad
  const defaultImages = [
    "/lovable-uploads/dafd81f1-18a1-4796-9a46-b39914b747a9.jpg",
    "/lovable-uploads/65a640f0-862a-47e4-bc80-4d6cc1f2599b.png",
    "/lovable-uploads/ed56aab2-6ded-4bab-a2ab-2471f2fc6442.png",
    "/lovable-uploads/5bcb79d0-1a05-40e3-9088-2836fa262778.png",
    "/lovable-uploads/3f3be815-8b79-44fa-89b0-d3d4f795e9a7.png",
    "/lovable-uploads/fd23279d-7903-4b82-871d-b0ab29e6e890.png"
  ];
  
  // Alternamos imágenes basándonos en el ID para que cada domo tenga un conjunto diferente
  const unitIndex = parseInt(unit.id) || 1;
  const startIndex = (unitIndex - 1) * 2;
  
  return [
    unit.image_url || defaultImages[0],
    defaultImages[(startIndex + 1) % defaultImages.length],
    defaultImages[(startIndex + 2) % defaultImages.length],
    defaultImages[(startIndex + 3) % defaultImages.length]
  ];
};
