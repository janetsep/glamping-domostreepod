import { Calendar, Users, Coffee, Droplets, Wifi, Flame, BedDouble, Mountain } from "lucide-react";
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
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  
  const packages = [
    {
      id: "48a7a330-ebae-4e79-8f53-31a84ac900d9",
      title: "Domo Araucaria",
      description: "Duerme bajo un manto de estrellas visibles desde la bóveda de cristal de nuestro domo exclusivo. Despertar con los primeros rayos del sol abrazando el bosque nativo nunca había sido tan mágico.",
      detailedDescription: "Un espacio único entre araucarias centenarias donde la arquitectura se funde con la naturaleza. Nuestros domos completamente equipados cuentan con terminaciones de lujo y vistas panorámicas al bosque y cielo estrellado.",
      price: 120000,
      originalPrice: 150000,
      image: "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png",
      interiorImage: "/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png",
      size: "32m²",
      features: ["2 noches de alojamiento", "Desayuno incluido", "Capacidad: 2 personas", "Vistas al bosque", "Acceso a senderos"],
      amenities: [
        { icon: <Coffee size={18} />, text: "Mini cocina equipada" },
        { icon: <Droplets size={18} />, text: "Ducha con agua caliente" },
        { icon: <Wifi size={18} />, text: "WiFi de alta velocidad" },
        { icon: <Flame size={18} />, text: "Calefacción ecológica" },
        { icon: <BedDouble size={18} />, text: "Cama king size premium" },
        { icon: <Mountain size={18} />, text: "Vistas panorámicas al bosque nativo" }
      ]
    },
    {
      id: "58a7a330-ebae-4e79-8f53-31a84ac900d8",
      title: "Domo Canelo",
      description: "Sumérgete en el lujo de la simplicidad con nuestro jacuzzi exterior privado mientras contemplas el atardecer sobre los árboles. Una experiencia que despertará todos tus sentidos.",
      detailedDescription: "El Domo Canelo, llamado así por el árbol sagrado mapuche, ofrece una experiencia de conexión profunda con la naturaleza sin renunciar al confort. Su jacuzzi al aire libre te permite contemplar las estrellas mientras te relajas en agua temperada.",
      price: 135000,
      originalPrice: 180000,
      image: "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png",
      interiorImage: "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png",
      size: "38m²",
      features: ["3 noches de alojamiento", "Desayuno incluido", "Capacidad: 2 personas", "Jacuzzi privado", "Wifi gratis"],
      amenities: [
        { icon: <Coffee size={18} />, text: "Cocina completamente equipada" },
        { icon: <Droplets size={18} />, text: "Jacuzzi exterior privado" },
        { icon: <Wifi size={18} />, text: "WiFi de alta velocidad" },
        { icon: <Flame size={18} />, text: "Sistema de calefacción central" },
        { icon: <BedDouble size={18} />, text: "Cama king size con ropa de cama premium" },
        { icon: <Mountain size={18} />, text: "Terraza con vistas al valle" }
      ]
    },
    {
      id: "68a7a330-ebae-4e79-8f53-31a84ac900d7",
      title: "Domo Coihue",
      description: "Experimenta la sensación de dormir entre las copas de los árboles. Nuestro domo elevado te ofrece una perspectiva única del bosque nativo desde cada ángulo y un despertar envuelto en naturaleza.",
      detailedDescription: "El Domo Coihue se eleva entre los árboles nativos para brindarte una experiencia única. Su diseño suspendido y su ducha panorámica te permiten sentirte parte del bosque, mientras disfrutas de todas las comodidades de un alojamiento de lujo.",
      price: 125000,
      originalPrice: 160000,
      image: "/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png",
      interiorImage: "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png",
      size: "36m²",
      features: ["2 noches de alojamiento", "Desayuno incluido", "Capacidad: 2 personas", "Ducha panorámica", "Mini cocina"],
      amenities: [
        { icon: <Coffee size={18} />, text: "Mini bar y café de especialidad" },
        { icon: <Droplets size={18} />, text: "Ducha panorámica con vista al bosque" },
        { icon: <Wifi size={18} />, text: "Conexión WiFi" },
        { icon: <Flame size={18} />, text: "Calefacción de bajo consumo" },
        { icon: <BedDouble size={18} />, text: "Cama queen con vistas al amanecer" },
        { icon: <Mountain size={18} />, text: "Terraza privada suspendida" }
      ]
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

  const toggleExpandUnit = (unitId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  };

  const handleReservationClick = () => {
    navigate(`/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9`);
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
        
        {/* Domos con efecto hover y expansión */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mb-16">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative rounded-lg overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 ${
                expandedUnit === pkg.id ? 'md:col-span-3 md:row-span-2 md:h-auto' : ''
              }`}
              onMouseEnter={() => !expandedUnit && setHoveredUnit(pkg.id)}
              onMouseLeave={() => !expandedUnit && setHoveredUnit(null)}
              onClick={() => expandedUnit ? null : handleUnitClick(pkg.id)}
            >
              {expandedUnit === pkg.id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-display font-bold text-primary">{pkg.title}</h3>
                      <button 
                        onClick={(e) => toggleExpandUnit(pkg.id, e)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <p className="text-gray-700">{pkg.detailedDescription}</p>
                    
                    <div className="flex items-center text-gray-700 font-medium">
                      <Users size={18} className="mr-2" />
                      <span>Capacidad: 2 personas</span>
                      <span className="mx-3">•</span>
                      <span>{pkg.size}</span>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Amenidades</h4>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        {pkg.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-700">
                            <span className="mr-2 text-primary">{amenity.icon}</span>
                            {amenity.text}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end pt-4">
                      <div>
                        <span className="text-gray-500 line-through text-sm">
                          ${pkg.originalPrice.toLocaleString()}
                        </span>
                        <div className="text-xl font-bold text-primary">
                          ${pkg.price.toLocaleString()}
                        </div>
                      </div>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnitClick(pkg.id);
                        }}
                        className="bg-accent hover:bg-accent/90"
                      >
                        Reservar ahora
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-64 overflow-hidden rounded-lg">
                      <img 
                        src={pkg.image} 
                        alt={`Exterior de ${pkg.title}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="h-64 overflow-hidden rounded-lg">
                      <img 
                        src={pkg.interiorImage} 
                        alt={`Interior de ${pkg.title}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
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
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => toggleExpandUnit(pkg.id, e)}
                            className="text-white text-sm bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
                          >
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Title visible when not hovering */}
                  <div className={`p-4 bg-white ${hoveredUnit === pkg.id ? 'opacity-0' : 'opacity-100'} transition-opacity absolute bottom-0 left-0 right-0`}>
                    <h3 className="text-xl font-display font-bold">{pkg.title}</h3>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* CTA después de la sección de domos */}
        <div className="mt-12 mb-16 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-8 text-center">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-primary mb-3">
            ¿Te imaginas despertando con estas vistas?
          </h3>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Reserva tu domo ahora y prepárate para vivir una experiencia inolvidable en medio de la naturaleza.
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 font-medium"
            onClick={handleReservationClick}
          >
            Asegura tu experiencia ahora
          </Button>
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
        
        {/* Disponibilidad limitada - Enhanced CTA */}
        <div className="text-center mt-10 mb-6">
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
          <p className="text-sm text-gray-500 mt-3">
            No esperes más, la naturaleza te está esperando
          </p>
        </div>
      </div>
    </section>
  );
};

export default Packages;
