
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface TravelerCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  overlay?: string;
}

const travelerCategories: TravelerCategory[] = [
  {
    id: "solo",
    title: "Para el viajero en solitario",
    description: "Un refugio perfecto para reconectar contigo mismo en medio de la naturaleza.",
    image: "/lovable-uploads/4545e1af-fa1f-4cac-8994-2e040c0a95c8.png"
  },
  {
    id: "simplicity",
    title: "Para quienes buscan simplicidad y descanso",
    description: "Un espacio minimalista donde el descanso y la tranquilidad son prioridad.",
    image: "/lovable-uploads/619d8dbf-d18c-4d22-9c72-9b823a2a52d1.png"
  },
  {
    id: "couple",
    title: "Para la pareja en busca de tranquilidad",
    description: "Bajo un cielo estrellado, las luces del domo crean un ambiente acogedor. Compartir una copa de vino en la terraza, con el bosque como único testigo, es el cierre perfecto para un día de caminatas y descanso en la tinaja de agua mineral.",
    image: "/lovable-uploads/1f579fd8-1af0-4397-9254-2cd8cbb54410.png",
    overlay: "dark"
  },
  {
    id: "special",
    title: "Para quienes celebran ocasiones especiales",
    description: "Un lugar único para conmemorar momentos importantes en un entorno mágico.",
    image: "/lovable-uploads/4bb0b8cf-adee-40c4-ac00-a3676ff6cdcc.png"
  },
  {
    id: "adventure",
    title: "Para los aventureros de montaña",
    description: "Base perfecta para explorar senderos y vivir la aventura en la cordillera.",
    image: "/lovable-uploads/7f7e32a2-1e84-49ce-9d9c-fd06aece4b05.png"
  },
  {
    id: "trekking",
    title: "Para los amantes del trekking",
    description: "Punto de partida ideal para recorrer los senderos más impresionantes del valle.",
    image: "/lovable-uploads/ba985569-8f29-4da1-af9c-2aba9a5a886b.png"
  },
  {
    id: "photographer",
    title: "Para el fotógrafo de naturaleza",
    description: "Escenarios únicos que capturarán tu lente y tu corazón en cada momento del día.",
    image: "/lovable-uploads/9f5ec7ea-f65b-46be-94ba-8df609f0a24f.png"
  },
  {
    id: "family",
    title: "Para familias que buscan exclusividad total",
    description: "Espacio privado donde toda la familia podrá disfrutar de la naturaleza con total libertad.",
    image: "/lovable-uploads/b8a0fbdb-9f9c-48fe-a336-e5d378411a67.png"
  }
];

const TravelerTypes = () => {
  const navigate = useNavigate();

  const handleReserveClick = (travelerType: string) => {
    navigate(`/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9?type=${travelerType}`);
  };

  return (
    <section id="traveler-types" className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
          Una Experiencia para Cada Viajero
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Cada huésped es único, y en TreePod hemos creado espacios que se adaptan a diferentes estilos de viaje y necesidades.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {travelerCategories.map((category) => (
            <div 
              key={category.id} 
              className="relative group rounded-lg overflow-hidden shadow-lg h-[350px] cursor-pointer"
              onClick={() => handleReserveClick(category.id)}
            >
              <div className="absolute inset-0">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.overlay === "dark" ? "from-black/80 to-black/40" : "from-black/70 to-transparent"} transition-opacity duration-300`}></div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2 leading-tight">{category.title}</h3>
                {category.id === "couple" ? (
                  <p className="text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-4">{category.description}</p>
                ) : (
                  <p className="text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{category.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Button 
            onClick={() => handleReserveClick("default")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-2 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <span>Reservar</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TravelerTypes;
