
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full bg-white bg-opacity-90 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/7f7e32a2-1e84-49ce-9d9c-fd06aece4b05.png" 
            alt="Domos Treepod" 
            className="h-14 w-auto"
          />
        </Link>
        <div className="flex gap-6">
          <Button variant="ghost" asChild>
            <Link to="/experiences">Experiencias</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/location">Ubicación</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/contact">Contacto</Link>
          </Button>
          <Button variant="default" onClick={() => navigate('/reservations')}>
            Reservar
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
