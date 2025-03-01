
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
  
  const packages = [
    {
      title: "Escapada Romántica",
      description: "Perfecta para parejas, incluye tinaja privada con vistas al bosque y cena especial a la luz de las velas.",
      price: 180000,
      originalPrice: 220000,
      image: "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png",
      features: ["2 noches de alojamiento", "Desayuno incluido", "Tinaja privada", "Cena romántica", "Botella de vino"]
    },
    {
      title: "Aventura en la Montaña",
      description: "Para los amantes de la naturaleza y la aventura, incluye trekking guiado y parrilla en tu domo.",
      price: 220000,
      originalPrice: 280000,
      image: "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png",
      features: ["3 noches de alojamiento", "Desayuno incluido", "Trekking guiado", "Kit de parrilla", "Mapas de senderos"]
    },
    {
      title: "Desconexión Total",
      description: "Experiencia sin tecnología, con actividades de relajación y reconexión con la naturaleza.",
      price: 200000,
      originalPrice: 250000,
      image: "/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png",
      features: ["2 noches de alojamiento", "Desayuno incluido", "Sesión de yoga", "Kit de meditación", "Hot tub privado"]
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

  const handleReserveClick = () => {
    navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9');
  };

  return (
    <section id="packages" className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
          Paquetes y Ofertas Especiales
        </h2>
        <p className="text-xl text-center text-gray-600 mb-6 max-w-3xl mx-auto">
          Aprovecha nuestras promociones de temporada y vive una experiencia inolvidable
        </p>
        
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
        
        {/* Paquetes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {packages.map((pkg, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="relative">
                <img 
                  src={pkg.image} 
                  alt={pkg.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
                  {Math.round((1 - (pkg.price / pkg.originalPrice)) * 100)}% OFF
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display font-bold mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{pkg.description}</p>
                
                <ul className="space-y-2 mb-4">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-accent">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <span className="text-gray-400 line-through text-sm">
                      ${pkg.originalPrice.toLocaleString()}
                    </span>
                    <div className="text-2xl font-bold text-primary">
                      ${pkg.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">por estadía</div>
                  </div>
                  <Button 
                    onClick={handleReserveClick}
                    className="bg-accent hover:bg-accent/90"
                  >
                    Reservar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Disponibilidad limitada */}
        <div className="text-center mt-10">
          <p className="text-sm text-red-600 font-semibold mb-4">
            ¡Solo quedan 3 domos disponibles para este fin de semana!
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={handleReserveClick}
          >
            Ver Disponibilidad
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Packages;
