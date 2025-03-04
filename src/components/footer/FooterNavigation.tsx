
import { ChevronRight, Home, BedDouble, Coffee, MessageSquare, MapPin, Leaf, Mail } from "lucide-react";

interface FooterNavigationProps {
  navigateTo: (path: string) => void;
}

const FooterNavigation = ({ navigateTo }: FooterNavigationProps) => {
  // Create a consistent menu that matches the header navigation
  const menuItems = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Domos", href: "/#packages", icon: BedDouble },
    { name: "Servicios", href: "/#benefits", icon: Coffee },
    { name: "Experiencias", href: "/#testimonials", icon: MessageSquare },
    { name: "Ubicación", href: "/#location", icon: MapPin },
    { name: "Blog", href: "/#blog", icon: Leaf },
    { name: "Sobre Nosotros", href: "/sobre-nosotros", icon: Leaf },
    { name: "Contacto", href: "/#contact", icon: Mail }
  ];

  return (
    <div>
      <h4 className="font-display font-bold text-lg mb-4">Menú</h4>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <button 
              onClick={() => navigateTo(item.href)} 
              className="text-gray-600 hover:text-primary flex items-center transition-colors cursor-pointer group"
            >
              <item.icon className="h-4 w-4 mr-2 group-hover:text-cyan-500" />
              <span className="group-hover:text-cyan-500 transition-colors">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterNavigation;
