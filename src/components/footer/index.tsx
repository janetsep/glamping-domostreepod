
import AboutSection from "./AboutSection";
import FooterNavigation from "./FooterNavigation";
import ContactInfo from "./ContactInfo";
import Newsletter from "./Newsletter";
import FooterLinks from "./FooterLinks";
import Copyright from "./Copyright";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    // Si es un hash link en la página principal
    if (path.startsWith('/#')) {
      // Si ya estamos en la página principal
      if (window.location.pathname === '/') {
        const element = document.getElementById(path.substring(2));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Si estamos en otra página, navegar a la página principal con el hash
        navigate(path);
      }
    } else {
      // Si es una ruta normal
      navigate(path);
      // Asegurar que la página se muestre desde el inicio
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="bg-secondary/20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <AboutSection />
          <FooterNavigation navigateTo={navigateTo} />
          <ContactInfo />
          <Newsletter />
        </div>
        
        {/* Additional Links */}
        <FooterLinks navigateTo={navigateTo} />
        
        {/* Copyright & Back to Top */}
        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;
