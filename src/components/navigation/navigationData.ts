
import { 
  Home, 
  House,
  MapPin, 
  ChefHat,
  Mail,
  Sparkles,
  Mountain,
  Dumbbell,
  Navigation,
  Droplets,
  Book,
  ImageIcon,
  TreePine,
  Gamepad,
  PartyPopper,
  Tent,
  Activity,
  Eye
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
  tabId?: string; // Added tabId property for targeting specific tab
  submenu?: SubMenuItem[]; // Added submenu property for nested menus
}

// Navigation links with icons - Actualizados para la nueva landing page
export const navigationLinks: NavLink[] = [
  { 
    name: "Inicio", 
    id: null,
    icon: Home, 
    path: "/", 
    description: "Volver al inicio"
  },
  { 
    name: "Experiencias", 
    id: "buyer-personas", 
    icon: Sparkles, 
    path: null, 
    description: "Descubre experiencias personalizadas",
    submenu: [
      { name: "Parejas Aventureras", id: "persona-parejas-jovenes", path: null, icon: Eye },
      { name: "Familias", id: "persona-familias", path: null, icon: Eye },
      { name: "Grupos de Amigos", id: "persona-grupos-amigos", path: null, icon: Eye },
      { name: "Experiencia Exclusiva", id: "persona-exclusividad-total", path: null, icon: Eye }
    ]
  },
  { 
    name: "Paquetes", 
    id: "packages-by-type", 
    icon: House, 
    path: null, 
    description: "Nuestros domos y paquetes por categoría"
  },
  { 
    name: "Testimonios", 
    id: "social-proof", 
    icon: Eye, 
    path: null, 
    description: "Lo que dicen nuestros huéspedes"
  },
  { 
    name: "Cultura", 
    id: "culture", 
    icon: TreePine, 
    path: null, 
    description: "Cultura, gastronomía y naturaleza local"
  },
  { 
    name: "Galería", 
    id: "gallery", 
    icon: ImageIcon, 
    path: null, 
    description: "Imágenes de nuestros domos y entorno"
  },
  { 
    name: "Ubicación", 
    id: "location", 
    icon: MapPin, 
    path: null, 
    description: "Cómo llegar al Valle Las Trancas"
  },
  { 
    name: "Contacto", 
    id: "contact", 
    icon: Mail, 
    path: null, 
    description: "Contáctanos para reservar"
  }
];
