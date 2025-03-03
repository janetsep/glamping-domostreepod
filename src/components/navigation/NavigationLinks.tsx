import { Button } from "@/components/ui/button";

interface NavigationLinksProps {
  isMobile: boolean;
  isScrolled: boolean;
  scrollToSection: (id: string) => void;
  navigateToPage: (path: string) => void;
}

export const NavigationLinks = ({
  isMobile,
  isScrolled,
  scrollToSection,
  navigateToPage
}: NavigationLinksProps) => {
  const links = [
    { name: "Inicio", path: "/" },  // Changed to use path for more reliable navigation
    { name: "Domos", id: "packages" },
    { name: "Servicios", id: "benefits" },
    { name: "Comentarios", id: "testimonials" },  // Changed from "Experiencias" to "Comentarios"
    { name: "Ubicación", id: "location" },
    { name: "Blog", id: "blog" },
    { name: "Sobre Nosotros", path: "/sobre-nosotros" },
    { name: "Contacto", id: "contact" },
  ];

  const handleClick = (link: { name: string; id?: string; path?: string }) => {
    if (link.path) {
      navigateToPage(link.path);
    } else if (link.id) {
      scrollToSection(link.id);
    }
  };

  if (isMobile) {
    return (
      <>
        {links.map((link) => (
          <button 
            key={link.name}
            onClick={() => handleClick(link)}
            className="py-3 border-b border-gray-100 text-left text-lg"
          >
            {link.name}
          </button>
        ))}
      </>
    );
  }

  return (
    <>
      {links.map((link) => (
        <Button
          key={link.name}
          variant={isScrolled ? "ghost" : "link"}
          onClick={() => handleClick(link)}
          className={`text-base md:text-lg font-medium ${isScrolled ? 'text-gray-700 hover:text-cyan-500' : 'text-white text-shadow'}`}
        >
          {link.name}
        </Button>
      ))}
    </>
  );
};
