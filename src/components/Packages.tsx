
import { Calendar, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { GlampingUnit } from "@/lib/supabase";
import { useState, useEffect } from "react";

interface PackagesProps {
  units: GlampingUnit[];
  isLoading: boolean;
}

const Packages = ({ units, isLoading }: PackagesProps) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 8, minutes: 45 });
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);
  
  const packages = [
    {
      id: "48a7a330-ebae-4e79-8f53-31a84ac900d9",
      title: "Domo Araucaria",
      description: "Domo autosustentable con amplia terraza, mini cocina equipada, zona de fogón, ducha con agua caliente y hermosas vistas al lago.",
      price: 120000,
      originalPrice: 150000,
      image: "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png",
      features: ["2 noches de alojamiento", "Desayuno incluido", "Capacidad: 2 personas", "Vistas al bosque", "Acceso a senderos"]
    },
    {
      id: "58a7a330-ebae-4e79-8f53-31a84ac900d8",
      title: "Domo Canelo",
      description: "Lujoso domo con jacuzzi al aire libre, terraza panorámica y vistas espectaculares al bosque nativo.",
      price: 135000,
      originalPrice: 180000,
      image: "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png",
      features: ["3 noches de alojamiento", "Desayuno incluido", "Capacidad: 2 personas", "Jacuzzi privado", "Wifi gratis"]
    },
    {
      id: "68a7a330-ebae-4e79-8f53-31a84ac900d7",
      title: "Domo Coihue",
      description: "Increíble domo suspendido entre árboles nativos con terraza privada y hermosas vistas al bosque y al lago.",
      price: 125000,
      originalPrice: 160000,
      image: "/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png",
      features: ["2 noches de alojamiento", "Desayuno incluido", "Capacidad: 2 personas", "Ducha panorámica", "Mini cocina"]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(current => {
        if (current.minutes > 0) {
          return { ...current, minutes: current.minutes - 1 };
        } else if (current.hours > 0) {
          return { ...current, hours: current.hours - 1, minutes: 59 };
        } else if (current.days > 0) {
          return { ...current, days: current.days - 1, hours: 23, minutes: 59 };
        }
        return current;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleUnitClick = (unitId: string) => {
    navigate(`/unit/${unitId}`);
  };

  return (
    <section id="packages" className="py-20 bg-secondary/10">
      {/* Franja de título sin texto */}
      <div className="w-full bg-primary/5 border-b border-primary/10 py-3 mb-16">
        <div className="container mx-auto px-4">
          {/* Título removido de la franja */}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
          Nuestros Domos Exclusivos
        </h2>
        <p className="text-xl text-center text-gray-600 mb-10 max-w-3xl mx-auto">
          Experiencias únicas de alojamiento en medio de la naturaleza
        </p>
        
        {/* Domos con efecto hover */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mb-16">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer group"
              onMouseEnter={() => setHoveredUnit(pkg.id)}
              onMouseLeave={() => setHoveredUnit(null)}
              onClick={() => handleUnitClick(pkg.id)}
            >
              <div className="h-72 relative overflow-hidden">
                <img 
                  src={pkg.image} 
                  alt={pkg.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay con información en hover */}
                <div 
                  className={`absolute inset-0 bg-black/60 flex flex-col justify-end p-6 transition-opacity duration-300 ${
                    hoveredUnit === pkg.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <h3 className="text-2xl font-display font-bold text-white mb-2">{pkg.title}</h3>
                  <p className="text-white/90 text-sm mb-3">{pkg.description}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-white/70 line-through text-sm">
                        ${pkg.originalPrice.toLocaleString()}
                      </span>
                      <div className="text-xl font-bold text-white">
                        ${pkg.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-white text-sm">Ver detalles →</div>
                  </div>
                </div>
              </div>
              
              {/* Title visible when not hovering */}
              <div className={`p-4 bg-white ${hoveredUnit === pkg.id ? 'opacity-0' : 'opacity-100'} transition-opacity absolute bottom-0 left-0 right-0`}>
                <h3 className="text-xl font-display font-bold">{pkg.title}</h3>
              </div>
            </div>
          ))}
        </div>
        
        {/* Contador de urgencia */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-10 max-w-2xl mx-auto">
          <div className="text-center mb-2">
            <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full uppercase font-semibold mb-2">Oferta por tiempo limitado</span>
            <h3 className="text-lg font-semibold">¡Descuento de temporada baja termina en:</h3>
          </div>
          <div className="flex justify-center space-x-4 text-center">
            <div className="bg-gray-100 p-2 rounded-lg">
              <div className="text-2xl font-bold">{timeLeft.days}</div>
              <div className="text-xs text-gray-500">Días</div>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <div className="text-2xl font-bold">{timeLeft.hours}</div>
              <div className="text-xs text-gray-500">Horas</div>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <div className="text-2xl font-bold">{timeLeft.minutes}</div>
              <div className="text-xs text-gray-500">Minutos</div>
            </div>
          </div>
        </div>
        
        {/* Disponibilidad limitada */}
        <div className="text-center mt-10">
          <p className="text-sm text-red-600 font-semibold mb-4">
            ¡Solo quedan 3 domos disponibles para este fin de semana!
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={() => handleUnitClick("48a7a330-ebae-4e79-8f53-31a84ac900d9")}
          >
            Ver Disponibilidad
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Packages;
