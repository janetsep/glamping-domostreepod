
import * as React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useScrollContext } from "@/components/navigation/ScrollContext";
import { mainNavLinks } from "./links";

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const { isScrolled } = useScrollContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  
  // Estado para almacenar el texto del título cuando estamos en una subpágina
  const [subpageTitle, setSubpageTitle] = React.useState<string | null>(null);
  
  // Determinar el título de la subpágina
  React.useEffect(() => {
    const currentPath = location.pathname;
    
    // Si estamos en la página principal, no hay título de subpágina
    if (currentPath === "/") {
      setSubpageTitle(null);
      return;
    }
    
    // Revisar las rutas y establecer el título correspondiente
    if (currentPath.includes("domos")) {
      setSubpageTitle("Domos");
    } else if (currentPath.includes("unit")) {
      setSubpageTitle("Reserva");
    } else if (currentPath.includes("tipo-viajero")) {
      setSubpageTitle("Experiencias");
    } else {
      setSubpageTitle(null);
    }
  }, [location.pathname]);
  
  return (
    <nav
      className={cn(
        "flex items-center gap-6 md:gap-10",
        className
      )}
    >
      {/* Mobile Menu Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="py-4">
            <div className="px-2 mb-8">
              {/* Mobile logo */}
              <h1 className="font-display text-lg font-bold tracking-tight">Domos Treepod</h1>
              <p className="text-sm text-gray-500">Valle Las Trancas</p>
            </div>
            <div className="flex flex-col space-y-3">
              {mainNavLinks.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block px-2 py-1 text-lg font-medium transition-all",
                      isActive
                        ? "text-primary font-medium"
                        : "text-gray-700 hover:text-primary"
                    )
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Logo / Title */}
      <Link to="/" className="flex items-center gap-1">
        <div className="font-display font-bold tracking-tight hidden md:block">
          {subpageTitle ? (
            <span className="text-gray-600">{subpageTitle}</span>
          ) : (
            <span className={cn(
              "transition-all duration-300",
              isScrolled ? "text-primary text-lg" : "text-white text-xl"
            )}>
              Domos Treepod
            </span>
          )}
        </div>
        <div className="font-display font-bold tracking-tight block md:hidden">
          <span className="text-primary text-lg">Domos</span>
        </div>
      </Link>
      
      {/* Desktop Navigation Links */}
      <div className="hidden md:flex md:items-center gap-6 ml-6">
        {mainNavLinks.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "text-sm font-medium transition-all duration-200 relative",
                isScrolled
                  ? isActive
                    ? "text-primary after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                    : "text-gray-700 hover:text-primary"
                  : isActive
                  ? "text-white after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-white"
                  : "text-gray-200 hover:text-white"
              )
            }
          >
            {item.title}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
