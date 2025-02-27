
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-5xl font-display font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Página no encontrada</p>
        
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
          {location.pathname.startsWith('/unit/') && (
            <>
              <br /><br />
              <span className="text-sm">
                Si estás intentando ver detalles de una unidad, asegúrate de que el ID sea válido. 
                Los IDs deben ser identificadores únicos proporcionados por el sistema.
              </span>
            </>
          )}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link to="/" className="flex items-center">
              <Home className="mr-2 w-4 h-4" />
              Ir al inicio
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="#" onClick={() => window.history.back()} className="flex items-center">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Volver atrás
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
