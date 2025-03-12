import { Home, Tent, MapPin, Mail, Sparkles, Mountain, ChefHat, Dumbbell } from "lucide-react";

interface FooterNavigationProps {
  navigateTo: (path: string) => void;
}

const FooterNavigation = ({ navigateTo }: FooterNavigationProps) => {
  // Create a consistent menu that matches the header navigation
  const menuItems = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Domos", href: "/#packages", icon: Tent },
    { name: "Experiencias", href: "/#benefits", icon: Sparkles, 
      submenu: [
        { name: "Wellness y relajación", href: "/#benefits", icon: Dumbbell },
        { name: "Aventura y trekking", href: "/#benefits", icon: Mountain },
        { name: "Gastronomía local", href: "/#benefits", icon: ChefHat }
      ]
    },
    { name: "Cómo llegar", href: "/#location", icon: MapPin },
    { name: "Sobre Nosotros", href: "/sobre-nosotros", icon: Sparkles },
    { name: "Contacto", href: "/#contact", icon: Mail }
  ];

  return (
    <div>
      <h4 className="font-display font-bold text-lg mb-4">Menú</h4>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <div>
              <button 
                onClick={() => navigateTo(item.href)} 
                className="text-gray-600 hover:text-primary flex items-center transition-colors cursor-pointer group"
              >
                <item.icon className="h-4 w-4 mr-2 group-hover:text-cyan-500" />
                <span className="group-hover:text-cyan-500 transition-colors">{item.name}</span>
              </button>
              
              {/* Submenu items */}
              {item.submenu && (
                <ul className="mt-1 ml-6 space-y-1">
                  {item.submenu.map((subItem) => (
                    <li key={subItem.name}>
                      <button
                        onClick={() => navigateTo(subItem.href)}
                        className="text-gray-500 hover:text-primary flex items-center transition-colors cursor-pointer group text-sm"
                      >
                        <subItem.icon className="h-3 w-3 mr-2 group-hover:text-cyan-500" />
                        <span className="group-hover:text-cyan-500 transition-colors">{subItem.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterNavigation;
