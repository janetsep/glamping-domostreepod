
import { useRef, useEffect } from "react";
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

interface NavLink {
  name: string;
  path: string | null;
  icon: LucideIcon;
  id: string | null;
}

interface NavTabsProps {
  navigationLinks: NavLink[];
  isScrolled: boolean;
  activeIndex: number;
  setHoveredIndex: (index: number | null) => void;
  handleNavClick: (index: number) => void;
}

const NavTabs = ({
  navigationLinks,
  isScrolled,
  activeIndex,
  setHoveredIndex,
  handleNavClick
}: NavTabsProps) => {
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="relative flex space-x-[3px] items-center">
      {navigationLinks.map((link, index) => {
        const Icon = link.icon;
        const isActive = index === activeIndex;
        
        return (
          <div
            key={link.name}
            ref={(el) => (tabRefs.current[index] = el)}
            className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[34px] ${
              isActive 
                ? isScrolled 
                  ? 'text-cyan-500 dark:text-cyan-400' 
                  : 'text-white font-medium dark:text-white' 
                : isScrolled 
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-white font-medium dark:text-gray-300'
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleNavClick(index)}
          >
            <div className="text-sm font-medium leading-5 whitespace-nowrap flex items-center justify-center h-full gap-2">
              <Icon className="h-4 w-4" />
              {link.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NavTabs;
