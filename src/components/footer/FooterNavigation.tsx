
import { ChevronRight } from "lucide-react";

interface FooterNavigationProps {
  navigateTo: (path: string) => void;
}

const FooterNavigation = ({ navigateTo }: FooterNavigationProps) => {
  return (
    <div>
      <h4 className="font-display font-bold text-lg mb-4">Menú</h4>
      <ul className="space-y-2">
        {[
          { name: "Inicio", href: "/" },
          { name: "Domos", href: "/#packages" },
          { name: "Servicios", href: "/#benefits" },
          { name: "Experiencias", href: "/#testimonials" },
          { name: "Ubicación", href: "/#location" },
          { name: "Sobre Nosotros", href: "/sobre-nosotros" },
          { name: "Contacto", href: "/#contact" }
        ].map((item) => (
          <li key={item.name}>
            <button 
              onClick={() => navigateTo(item.href)} 
              className="text-gray-600 hover:text-primary flex items-center transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4 mr-1" />
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterNavigation;
