
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

const CultureSection = () => {
  const [activeTab, setActiveTab] = useState("cultura");

  const tabs = [
    {
      id: "cultura",
      name: "Cultura",
      title: "Cultura Local",
      content: "Rica y diversa, el Valle Las Trancas entrelaza raíces mapuches, tradiciones españolas, historia de Los Pincheira, y la resistencia de sus comunidades modernas. Las culturas nativas influyen fuertemente en la forma de vida del valle, desde los nombres de ríos, montañas y bosques hasta el arte y la arquitectura en las ciudades modernas. Aprendemos el significado de los tótems ancestrales, experimentamos danzas ceremoniales, y reflexionamos sobre una forma de vida construida en la preservación del mundo natural con intención.",
      image: "/lovable-uploads/65a640f0-862a-47e4-bc80-4d6cc1f2599b.png"
    },
    {
      id: "gastronomia",
      name: "Gastronomía", 
      title: "Gastronomía",
      content: "Productos frescos de nuestro propio invernadero y la rica tradición culinaria de la región de Ñuble se combinan para crear experiencias gastronómicas únicas. Ingredientes locales, técnicas tradicionales y el sabor auténtico de la cordillera andina se encuentran en cada platillo que ofrecemos, respetando tanto las tradiciones ancestrales como las innovaciones modernas de la cocina chilena.",
      image: "/lovable-uploads/ed56aab2-6ded-4bab-a2ab-2471f2fc6442.png"
    },
    {
      id: "naturaleza",
      name: "Naturaleza",
      title: "Naturaleza",
      content: "El bosque nativo que rodea TreePod es hogar de especies endémicas de la cordillera de los Andes. Aquí, el silencio se rompe solo con el sonido del viento entre las copas de los árboles centenarios y el murmullo del río Chillán con sus aguas mineralizadas. Cada sendero cuenta una historia de conservación, cada amanecer revela la majestuosidad de un ecosistema preservado para las futuras generaciones.",
      image: "/lovable-uploads/5bcb79d0-1a05-40e3-9088-2836fa262778.png"
    },
    {
      id: "historia",
      name: "Historia",
      title: "Historia",
      content: "Las Termas de Chillán y el Valle Las Trancas han sido testigos de la historia de Chile desde tiempos ancestrales. Los pueblos mapuches consideraban estas aguas sagradas, y las leyendas de Los Pincheira aún resuenan en estos parajes. Cada rincón del valle guarda secretos de épocas pasadas, desde las primeras comunidades hasta los exploradores que catalogaron las propiedades únicas de estas aguas mineralizadas.",
      image: "/lovable-uploads/3f3be815-8b79-44fa-89b0-d3d4f795e9a7.png"
    },
    {
      id: "experiencia",
      name: "Experiencia",
      title: "Experiencia TreePod",
      content: "Más que un simple alojamiento, TreePod ofrece una conexión auténtica con la naturaleza sin sacrificar el confort moderno. Desde las tinajas con aguas mineralizadas hasta la conexión WiFi Starlink, cada detalle está pensado para crear momentos inolvidables. Aquí, la vida se ralentiza, las estrellas brillan más intensas, y cada respiración está llena del aire puro de la cordillera.",
      image: "/lovable-uploads/fd23279d-7903-4b82-871d-b0ab29e6e890.png"
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <Section
      id="culture"
      className="py-16 bg-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[500px]">
          {/* Navegación lateral */}
          <div className="lg:col-span-3">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`block w-full text-left px-4 py-3 text-lg font-serif transition-all duration-200 border-l-4 ${
                    activeTab === tab.id 
                      ? 'border-primary text-primary bg-white shadow-sm font-medium' 
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-5">
            <div className="pr-8">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">
                {activeTabData.title}
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed font-serif text-base">
                  {activeTabData.content}
                </p>
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className="lg:col-span-4">
            <div className="relative h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
              <LazyLoadImage
                src={activeTabData.image}
                alt={activeTabData.title}
                effect="blur"
                className="w-full h-full object-cover"
                wrapperClassName="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CultureSection;
