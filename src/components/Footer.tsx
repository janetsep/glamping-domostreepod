
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  MapPin, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MessageSquare, 
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("¡Suscripción exitosa!", {
      description: "Pronto recibirás nuestras novedades y ofertas especiales."
    });
    setEmail("");
  };

  return (
    <footer className="bg-secondary/20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and About */}
          <div>
            <img 
              src="/lovable-uploads/0d4b95ab-56f3-4e89-9fb7-86f3f232bbdc.png" 
              alt="Domos Treepod Logo" 
              className="h-24 mb-4"
            />
            <h3 className="text-lg font-display font-bold text-primary mb-3">Experiencias únicas en la naturaleza</h3>
            <p className="text-gray-600 text-sm mb-4">
              Ofrecemos una experiencia de glamping única en el Valle Las Trancas, 
              combinando el lujo de un hotel con la aventura del camping.
            </p>
          </div>
          
          {/* Navigation Menu */}
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
                  <Link 
                    to={item.href} 
                    className="text-gray-600 hover:text-primary flex items-center transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                <span>
                  Camino a la Montaña km 5,<br />
                  Valle Las Trancas, Chile<br />
                  Código Postal: 5480000
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                <a href="tel:+56912345678" className="hover:text-primary transition-colors">
                  +56 9 1234 5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                <a href="mailto:info@domostreepod.cl" className="hover:text-primary transition-colors">
                  info@domostreepod.cl
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 flex-shrink-0 text-primary" />
                <a 
                  href="https://wa.me/56912345678" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <Button variant="ghost" size="icon" asChild className="bg-white hover:bg-primary/10 shadow-sm">
                <Link to="https://facebook.com" target="_blank" aria-label="Facebook">
                  <Facebook className="h-5 w-5 text-primary" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="bg-white hover:bg-primary/10 shadow-sm">
                <Link to="https://instagram.com" target="_blank" aria-label="Instagram">
                  <Instagram className="h-5 w-5 text-primary" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="bg-white hover:bg-primary/10 shadow-sm">
                <Link to="https://youtube.com" target="_blank" aria-label="YouTube">
                  <Youtube className="h-5 w-5 text-primary" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Novedades y Ofertas</h4>
            <p className="text-gray-600 text-sm mb-4">
              Suscríbete a nuestro newsletter para recibir ofertas exclusivas y novedades.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white"
              />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                Suscribirme
              </Button>
            </form>
          </div>
        </div>
        
        {/* Additional Links */}
        <div className="border-t border-gray-200 pt-8 pb-6">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link to="#" className="text-sm text-gray-600 hover:text-primary">
              Términos y Condiciones
            </Link>
            <Link to="#" className="text-sm text-gray-600 hover:text-primary">
              Política de Privacidad
            </Link>
            <Link to="#" className="text-sm text-gray-600 hover:text-primary">
              Política de Cancelación
            </Link>
            <Link to="#" className="text-sm text-gray-600 hover:text-primary">
              Preguntas Frecuentes
            </Link>
            <Link to="/sobre-nosotros" className="text-sm text-gray-600 hover:text-primary">
              Sobre Nosotros
            </Link>
            <Link to="#" className="text-sm text-gray-600 hover:text-primary">
              Mapa del Sitio
            </Link>
          </div>
        </div>
        
        {/* Copyright & Back to Top */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">&copy; 2024 Domos Treepod. Todos los derechos reservados.</p>
            <Button 
              variant="ghost" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="text-primary text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver arriba
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
