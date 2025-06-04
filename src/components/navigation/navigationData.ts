
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
  Activity
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

// Navigation links with icons - Reordenadas según solicitud
export const navigationLinks: NavLink[] = [
  { 
    name: "Domos", 
    id: "packages", 
    icon: House, 
    path: null, 
    description: "Nuestras opciones para cada tipo de viajero",
    submenu: [
      { name: "Galería", id: "gallery", path: null, icon: ImageIcon },
      { name: "Cómo llegar", id: "location", path: null, icon: Navigation }
    ]
  },
  { 
    name: "Experiencias", 
    id: "benefits", 
    icon: Sparkles, 
    path: null, 
    description: "Descubre lo que ofrecemos",
    submenu: [
      { name: "Celebraciones", id: "celebrations", path: null, icon: PartyPopper },
      { 
        name: "Actividades", 
        id: "benefits", 
        path: null, 
        icon: Activity,
        submenu: [
          { name: "Recorridos y Paisajes", id: "benefits", path: null, icon: Mountain, tabId: "recorridos" },
          { name: "Historias y Cultura Local", id: "benefits", path: null, icon: Book, tabId: "historias" },
          { name: "Baño de Bosque", id: "benefits", path: null, icon: TreePine, tabId: "bosque" },
          { name: "Juegos de Mesa", id: "benefits", path: null, icon: Gamepad, tabId: "juegos" }
        ]
      }
    ]
  },
  { name: "Contacto", id: "contact", icon: Mail, path: null }
];
