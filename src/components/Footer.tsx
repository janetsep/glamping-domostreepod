
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Contacto</h4>
            <p className="text-gray-600">
              Email: info@glamping.com<br />
              Teléfono: +56 9 1234 5678
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Ubicación</h4>
            <p className="text-gray-600">
              Camino a la Montaña km 5,<br />
              Región de Los Lagos, Chile
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <Button variant="link" asChild>
                <Link to="#" className="text-gray-600 hover:text-primary">Instagram</Link>
              </Button>
              <Button variant="link" asChild>
                <Link to="#" className="text-gray-600 hover:text-primary">Facebook</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-gray-500">
          <p>&copy; 2024 Glamping Experience. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
