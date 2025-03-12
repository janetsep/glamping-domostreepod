
import { 
  Home, 
  House,
  MapPin, 
  ChefHat,
  Mail,
  Sparkles,
  Mountain,
  Dumbbell
} from "lucide-react";

export interface NavLink {
  name: string;
  path: string | null;
  icon: any;
  id: string | null;
  description?: string;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  name: string;
  id: string | null;
  path: string | null;
  icon: any;
}

// Navigation links with icons
export const navigationLinks: NavLink[] = [
  { name: "Inicio", path: "/", icon: Home, id: null },
  { name: "Domos", id: "packages", icon: House, path: null, description: "Nuestras opciones de alojamiento" },
  { 
    name: "Experiencias", 
    id: "benefits", 
    icon: Sparkles, 
    path: null, 
    description: "Descubre lo que ofrecemos",
    submenu: [
      { name: "Wellness y relajación", id: "benefits", path: null, icon: Dumbbell },
      { name: "Aventura y trekking", id: "benefits", path: null, icon: Mountain },
      { name: "Gastronomía local", id: "benefits", path: null, icon: ChefHat }
    ]
  },
  { name: "Cómo llegar", id: "location", icon: MapPin, path: null, description: "Sur de Chile" },
  { name: "Contacto", id: "contact", icon: Mail, path: null }
];
