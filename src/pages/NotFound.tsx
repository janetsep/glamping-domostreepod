
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { notFoundContent } from "@/data/content/notFound";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: Usuario intentó acceder a una ruta inexistente:",
      location.pathname
    );
    
    // Mostrar toast con mensaje de error
    toast.error("Página no encontrada", {
      description: "La URL que intentas acceder no existe o ha sido movida."
    });
  }, [location.pathname]);

  const goToHome = () => {
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-5xl font-display font-bold text-primary mb-4">{notFoundContent.title}</h1>
        <p className="text-xl text-gray-700 mb-6">{notFoundContent.subtitle}</p>
        
        <p className="text-gray-600 mb-8">
          {notFoundContent.message}
          {location.pathname.startsWith('/unit/') && (
            <>
              <br /><br />
              <span className="text-sm">
                {notFoundContent.unitDetailMessage}
              </span>
            </>
          )}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="default" 
            onClick={goToHome}
            className="flex items-center"
          >
            <Home className="mr-2 w-4 h-4" />
            {notFoundContent.homeButton}
          </Button>
          <Button 
            variant="outline" 
            onClick={goBack}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            {notFoundContent.backButton}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
