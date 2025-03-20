
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
  Gamepad
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
      { name: "Recorridos y Paisajes", id: "benefits", path: null, icon: Mountain, tabId: "recorridos" },
      { name: "Historias y Cultura Local", id: "benefits", path: null, icon: Book, tabId: "historias" },
      { name: "Baño de Bosque", id: "benefits", path: null, icon: TreePine, tabId: "bosque" },
      { name: "Juegos de Mesa", id: "benefits", path: null, icon: Gamepad, tabId: "juegos" }
    ]
  },
  { name: "Galería", id: "gallery", icon: ImageIcon, path: null },
  { name: "Cómo llegar", id: "location", icon: Navigation, path: null, description: "Sur de Chile" },
  { name: "Contacto", id: "contact", icon: Mail, path: null }
];
