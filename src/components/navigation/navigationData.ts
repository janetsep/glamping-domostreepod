import { 
  Home, 
  House,
  MapPin, 
  Mail,
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
  tabId?: string;
  submenu?: SubMenuItem[];
}

// Navegación simplificada para embudo de ventas
export const navigationLinks: NavLink[] = [
  { 
    name: "Inicio", 
    id: null,
    icon: Home, 
    path: "/", 
    description: "Volver al inicio"
  },
  { 
    name: "Paquetes", 
    id: "packages", 
    icon: House, 
    path: null, 
    description: "Ver nuestros paquetes disponibles"
  },
  { 
    name: "Testimonios", 
    id: "testimonios", 
    icon: Eye, 
    path: null, 
    description: "Lo que dicen nuestros huéspedes"
  },
  { 
    name: "Ubicación", 
    id: "ubicacion", 
    icon: MapPin, 
    path: null, 
    description: "Cómo llegar"
  },
  { 
    name: "Contacto", 
    id: "contacto", 
    icon: Mail, 
    path: null, 
    description: "Reservar ahora"
  }
];