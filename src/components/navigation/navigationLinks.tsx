
import { 
  Home, 
  Coffee, 
  MessageSquare, 
  MapPin, 
  Leaf, 
  Mail,
  BedDouble,
  LucideIcon
} from "lucide-react";

export interface NavLink {
  name: string;
  path: string | null;
  icon: LucideIcon;
  id: string | null;
}

// Navigation links with icons
export const navigationLinks: NavLink[] = [
  { name: "Inicio", path: "/", icon: Home, id: null },
  { name: "Domos", id: "packages", icon: BedDouble, path: null },
  { name: "Servicios", id: "benefits", icon: Coffee, path: null },
  { name: "Comentarios", id: "testimonials", icon: MessageSquare, path: null },
  { name: "Ubicación", id: "location", icon: MapPin, path: null },
  { name: "Blog", id: "blog", icon: Leaf, path: null },
  { name: "Contacto", id: "contact", icon: Mail, path: null },
];
