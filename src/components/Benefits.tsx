
import { Flame, Tent, Utensils, Star, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Benefits = () => {
  const navigate = useNavigate();
  
  const benefits = [
    {
      icon: <Flame className="w-12 h-12 text-accent" />,
      title: "Tinajas de Ciprés con Agua Mineralizada",
      description: "Único en la región, disfruta de un baño relajante en tinajas tradicionales con propiedades terapéuticas.",
      image: "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png"
    },
    {
      icon: <Tent className="w-12 h-12 text-accent" />,
      title: "Domos Geodésicos en un Bosque Nativo",
      description: "Confort sin perder la conexión con la naturaleza, despierta rodeado de árboles centenarios.",
      image: "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png"
    },
    {
      icon: <Utensils className="w-12 h-12 text-accent" />,
      title: "Gastronomía Local y Sostenible",
      description: "Ingredientes frescos de nuestro invernadero, sabores auténticos de la región.",
      image: "/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png"
    },
    {
      icon: <Star className="w-12 h-12 text-accent" />,
      title: "Cielo Estrellado y Tranquilidad Absoluta",
      description: "Experiencia sin contaminación lumínica, observa las estrellas como nunca antes.",
      image: "/lovable-uploads/abaa63a0-8f4a-4939-96f9-808ed3d09802.png"
    },
    {
      icon: <Map className="w-12 h-12 text-accent" />,
      title: "Actividades Exclusivas",
      description: "Trekking, termas, cultura local y mucho más para hacer de tu estadía una experiencia inolvidable.",
      image: "/lovable-uploads/7f7e32a2-1e84-49ce-9d9c-fd06aece4b05.png"
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
          ¿Por qué elegir TreePod?
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Nuestro glamping ofrece una experiencia única que combina la belleza natural con comodidades exclusivas
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white border border-gray-100"
            >
              <div className="mb-4 flex justify-center">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-center">{benefit.title}</h3>
              <p className="text-gray-600 mb-4 text-center">{benefit.description}</p>
              <div className="h-48 overflow-hidden rounded-lg mb-2">
                <img 
                  src={benefit.image} 
                  alt={benefit.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9')}
            className="bg-primary hover:bg-primary/90"
            size="lg"
          >
            Descubre por qué TreePod es diferente
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
