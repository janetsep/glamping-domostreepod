
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
      { name: "Tinajas de Ciprés", id: "benefits", path: null, icon: Droplets },
      { name: "Recorridos y Paisajes", id: "benefits", path: null, icon: Mountain },
      { name: "Historias y Cultura Local", id: "benefits", path: null, icon: Book },
      { name: "Baño de Bosque", id: "benefits", path: null, icon: TreePine },
      { name: "Juegos de Mesa", id: "benefits", path: null, icon: Gamepad }
    ]
  },
  { name: "Galería", id: "gallery", icon: ImageIcon, path: null },
  { name: "Cómo llegar", id: "location", icon: Navigation, path: null, description: "Sur de Chile" },
  { name: "Contacto", id: "contact", icon: Mail, path: null }
];
