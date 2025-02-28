
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, MapPin, ArrowLeft } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/20 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/lovable-uploads/0d4b95ab-56f3-4e89-9fb7-86f3f232bbdc.png" 
            alt="Domos Treepod Logo" 
            className="h-28 mb-4"
          />
          <h3 className="text-xl font-display font-bold text-primary">Experiencias únicas en la naturaleza</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Desayuno incluido</li>
              <li>Wi-Fi gratis</li>
              <li>Estacionamiento privado</li>
              <li>Tours guiados</li>
              <li>Servicio a la habitación</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Ubicación</h4>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
              <p>
                Camino a la Montaña km 5,<br />
                Región de Los Lagos, Chile<br />
                Código Postal: 5480000
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Nosotros</h4>
            <p className="text-gray-600">
              Somos un equipo apasionado por brindar experiencias únicas en medio de la naturaleza. 
              Nuestro glamping combina el confort de un hotel boutique con la aventura del camping tradicional.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Contacto</h4>
            <div className="space-y-2 text-gray-600">
              <p>Email: info@domostreepod.cl</p>
              <p>Teléfono: +56 9 1234 5678</p>
              <div className="flex gap-4 mt-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="https://facebook.com" target="_blank" aria-label="Facebook">
                    <Facebook className="h-5 w-5 text-primary" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="https://instagram.com" target="_blank" aria-label="Instagram">
                    <Instagram className="h-5 w-5 text-primary" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="https://youtube.com" target="_blank" aria-label="YouTube">
                    <Youtube className="h-5 w-5 text-primary" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver arriba
            </Button>
            <p className="text-gray-500">&copy; 2024 Domos Treepod. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
