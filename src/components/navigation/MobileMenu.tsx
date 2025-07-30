import { useState } from "react";
import { Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationLinks } from "./NavigationLinks";
import ReserveButton from "./ReserveButton";

interface MobileMenuProps {
  isScrolled: boolean;
  handleReserveClick: () => void;
  scrollToSection: (id: string) => void;
  navigateToPage: (path: string) => void;
}

const MobileMenu = ({
  isScrolled,
  handleReserveClick,
  scrollToSection,
  navigateToPage,
}: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigateTo = (id: string) => {
    scrollToSection(id);
    setIsOpen(false);
  };

  const handleNavigateToPage = (path: string) => {
    navigateToPage(path);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center">
      <a 
        href="https://wa.me/56912345678" 
        target="_blank" 
        rel="noopener noreferrer"
        className="mr-2 bg-green-500 text-white p-2 rounded-lg shadow-md hover:bg-green-600 transition-colors flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <MessageSquare className="h-5 w-5" />
      </a>
      <ReserveButton
        isScrolled={isScrolled}
        handleReserveClick={handleReserveClick}
      />
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`ml-2 ${
              isScrolled
                ? "text-gray-700 hover:text-cyan-500 hover:bg-cyan-50/50"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0">
          <div className="h-full flex flex-col">
            <div className="p-6 overflow-y-auto flex-grow">
              <NavigationLinks
                isMobile={true}
                isScrolled={true}
                scrollToSection={handleNavigateTo}
                navigateToPage={handleNavigateToPage}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
