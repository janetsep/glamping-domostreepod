import { Droplets, Mountain, Book, Wifi, Bath, Heart, Star, Bike, Map, Coffee, Utensils, Car, Flame as LucideFlame, SquareLibrary } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Benefits = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("banos");
  
  const experiencesData = {
    banos: {
      title: "Baños de Agua Mineralizada",
      description: "Renueva cuerpo y mente con nuestras experiencias de bienestar y aguas termales",
      items: [{
        icon: <Bath className="w-12 h-12 text-accent" />,
        title: "Tinajas de Ciprés con Agua Mineralizada",
        description: "Nuestras tinajas artesanales están fabricadas con madera de ciprés patagónico y se llenan con agua mineralizada tratada que se calienta a una temperatura ideal de 38-40°C. Esta experiencia única proporciona beneficios como relajación muscular, mejor circulación sanguínea y reducción del estrés.",
        details: "Las tinajas son preparadas exclusivamente para tu reserva y cuentan con vistas privilegiadas al bosque nativo. El agua mineralizada está enriquecida con sales naturales que favorecen la desintoxicación y el bienestar general.",
        image: "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png"
      }, {
        icon: <Heart className="w-12 h-12 text-accent" />,
        title: "Masajes y Terapias Alternativas",
        description: "Ofrecemos sesiones de masajes terapéuticos y técnicas de relajación con terapeutas certificados que utilizan productos naturales de la zona.",
        details: "Puedes reservar con anticipación una sesión en la privacidad de tu domo o en nuestro espacio dedicado con vistas al valle. Trabajamos con aceites esenciales de plantas nativas que potencian los beneficios curativos.",
        image: "/lovable-uploads/abaa63a0-8f4a-4939-96f9-808ed3d09802.png"
      }, {
        icon: <Star className="w-12 h-12 text-accent" />,
        title: "Baño de Bosque Guiado",
        description: "Practica 'shinrin-yoku', la terapia japonesa de inmersión en el bosque, con caminatas conscientes en nuestro entorno natural.",
        details: "Un guía especializado te llevará por senderos exclusivos dentro de nuestro terreno, donde realizarás ejercicios de respiración y meditación para conectar profundamente con la naturaleza. Estudios científicos demuestran que esta práctica reduce el cortisol y fortalece el sistema inmunológico.",
        image: "/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png"
      }]
    },
    recorridos: {
      title: "Recorridos y Paisajes",
      description: "Explora la naturaleza patagónica con nuestras experiencias de aventura y senderismo",
      items: [{
        icon: <Mountain className="w-12 h-12 text-accent" />,
        title: "Trekking en Senderos Exclusivos",
        description: "Rutas de senderismo para todos los niveles en colaboración con guías locales certificados que conocen cada rincón del territorio.",
        details: "Contamos con alianzas con los mejores guías de montaña de la región que te llevarán a descubrir lagos ocultos, miradores panorámicos y bosques centenarios. Cada ruta está clasificada por dificultad y duración para que elijas la que mejor se adapte a tus preferencias.",
        image: "/lovable-uploads/7f7e32a2-1e84-49ce-9d9c-fd06aece4b05.png"
      }, {
        icon: <Bike className="w-12 h-12 text-accent" />,
        title: "Cicloturismo y Mountain Bike",
        description: "Recorridos en bicicleta por los alrededores, con rutas especialmente diseñadas para disfrutar del paisaje a tu ritmo.",
        details: "Disponemos de bicicletas de montaña de alta gama para alquilar y mapas detallados de las mejores rutas. Nuestros socios locales ofrecen tours guiados que incluyen paradas en miradores increíbles y productores artesanales de la zona.",
        image: "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png"
      }, {
        icon: <Map className="w-12 h-12 text-accent" />,
        title: "Excursiones a Parques Nacionales",
        description: "Tours organizados a los parques nacionales cercanos, con transporte incluido y guías especializados en flora y fauna nativa.",
        details: "Trabajamos con operadores turísticos locales que ofrecen excursiones a los parques nacionales más emblemáticos de la región. Incluyen transporte desde nuestra propiedad, almuerzo gourmet y guías bilingües apasionados por la conservación.",
        image: "/lovable-uploads/abaa63a0-8f4a-4939-96f9-808ed3d09802.png"
      }]
    },
    historias: {
      title: "Historias y Cultura Local",
      description: "Descubre las tradiciones y sabores de la cultura patagónica",
      items: [{
        icon: <Coffee className="w-12 h-12 text-accent" />,
        title: "Gastronomía Típica Chilena",
        description: "Cada mañana recibirás una canasta con pan recién horneado, mermeladas caseras, frutas de temporada y productos lácteos de granjas cercanas.",
        details: "Nuestro desayuno es preparado al amanecer con ingredientes cuidadosamente seleccionados. Incluye opciones para todas las preferencias alimentarias, incluyendo alternativas veganas y sin gluten. El café orgánico proviene de una cooperativa regional que practica comercio justo.",
        image: "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png"
      }, {
        icon: <Utensils className="w-12 h-12 text-accent" />,
        title: "Cocina Local y Tradiciones",
        description: "Para ocasiones especiales, contrata a nuestro chef que preparará una cena romántica en tu domo o un picnic para llevar en tus excursiones.",
        details: "Nuestro chef crea menús personalizados utilizando hierbas frescas de nuestro invernadero orgánico y productos de temporada. Los picnics incluyen embutidos artesanales, quesos locales, conservas caseras y vinos de pequeñas bodegas de la región.",
        image: "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png"
      }, {
        icon: <Book className="w-12 h-12 text-accent" />,
        title: "Historias del Valle Las Trancas",
        description: "Conoce la historia y cultura del valle a través de relatos de sus habitantes y visitas a lugares emblemáticos.",
        details: "Organizamos charlas con lugareños que llevan generaciones viviendo en el valle, quienes comparten sus conocimientos sobre la flora medicinal nativa, leyendas locales y la evolución del turismo en la zona. También puedes visitar pequeños museos y centros culturales cercanos.",
        image: "/lovable-uploads/9e606128-1db3-42ce-b1ca-0474a875279f.png"
      }]
    },
    comodidades: {
      title: "Comodidades Extra",
      description: "Disfruta de detalles adicionales que harán tu estadía más placentera",
      items: [{
        icon: <Wifi className="w-12 h-12 text-accent" />,
        title: "Wifi Starlink de Alta Velocidad",
        description: "Conexión a internet satelital de última generación que garantiza estabilidad incluso en esta ubicación remota.",
        details: "Aunque promovemos la desconexión digital, entendemos que a veces es necesario mantenerse comunicado. Nuestro servicio Starlink ofrece velocidades de hasta 150 Mbps, permitiéndote trabajar remotamente o contactar con tus seres queridos sin problemas.",
        image: "/lovable-uploads/abaa63a0-8f4a-4939-96f9-808ed3d09802.png"
      }, {
        icon: <Car className="w-12 h-12 text-accent" />,
        title: "Estacionamiento Privado y Seguro",
        description: "Cada domo cuenta con su propio espacio de estacionamiento, techado y con iluminación nocturna.",
        details: "El acceso al estacionamiento está controlado y vigilado las 24 horas para tu tranquilidad. Además, ofrecemos servicio de limpieza de vehículos y asistencia en caso de problemas mecánicos a través de nuestros colaboradores locales.",
        image: "/lovable-uploads/7f7e32a2-1e84-49ce-9d9c-fd06aece4b05.png"
      }, {
        icon: <LucideFlame className="w-12 h-12 text-accent" />,
        title: "Parrilla Privada y Leña",
        description: "Disfruta de un asado al estilo patagónico con nuestra parrilla exclusiva y leña seleccionada para un sabor óptimo.",
        details: "Proveemos kit de asador, leña seca y carbón para que disfrutes de la experiencia completa. Si lo prefieres, podemos coordinar un asador profesional que prepare el fuego y te aconseje sobre los mejores cortes y técnicas de cocción.",
        image: "/lovable-uploads/f0a226af-4b5a-47f8-9a16-71ebc00d5039.png"
      }, {
        icon: <SquareLibrary className="w-12 h-12 text-accent" />,
        title: "Biblioteca y Juegos de Mesa",
        description: "Una selección cuidada de libros sobre la región, naturaleza y bienestar, junto con juegos de mesa para compartir momentos especiales.",
        details: "Nuestra biblioteca incluye guías de identificación de aves y plantas nativas, novelas ambientadas en la Patagonia y libros de fotografía local. Los juegos de mesa van desde clásicos familiares hasta opciones estratégicas para largas tardes junto al fuego.",
        image: "/lovable-uploads/04ce7b83-26de-4148-a84b-6b62dd46101f.png"
      }]
    }
  };
  
  return (
    <section id="benefits" className="py-20 bg-white">
      {/* Franja de título sin texto */}
      <div className="w-full bg-primary/5 border-b border-primary/10 py-3 mb-16">
        <div className="container mx-auto px-4">
          {/* Título removido de la franja */}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-cyan-500 mb-4 text-center">Experiencias</h2>
        <p className="text-xl text-center text-gray-600 mb-10 max-w-3xl mx-auto">Explora, relájate y saborea lo mejor de Valle Las Trancas con nuestras actividades pensadas para disfrutar el entorno.</p>
        
        {/* New TabsUI component matching the image style */}
        <div className="mb-8">
          <Tabs defaultValue="banos" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6 bg-gray-100 p-1 rounded-md">
              <TabsTrigger value="banos">Baños de Agua Mineralizada</TabsTrigger>
              <TabsTrigger value="recorridos">Recorridos y Paisajes</TabsTrigger>
              <TabsTrigger value="historias">Historias y Cultura Local</TabsTrigger>
              <TabsTrigger value="comodidades">Comodidades Extra</TabsTrigger>
            </TabsList>
            
            <TabsContent value="banos" className="space-y-4">
              <CategoryContent category={experiencesData.banos} />
            </TabsContent>
            
            <TabsContent value="recorridos" className="space-y-4">
              <CategoryContent category={experiencesData.recorridos} />
            </TabsContent>
            
            <TabsContent value="historias" className="space-y-4">
              <CategoryContent category={experiencesData.historias} />
            </TabsContent>
            
            <TabsContent value="comodidades" className="space-y-4">
              <CategoryContent category={experiencesData.comodidades} />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Category Icons below tabs matching second image */}
        <div className="flex justify-center items-center space-x-8 mb-10 text-center">
          <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveTab("banos")}>
            <Droplets className={`w-8 h-8 mb-1 ${activeTab === "banos" ? "text-cyan-500" : "text-gray-500"}`} />
            <span className={`text-xs ${activeTab === "banos" ? "font-medium" : "text-gray-500"}`}>Baños de Agua Mineralizada</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveTab("recorridos")}>
            <Mountain className={`w-8 h-8 mb-1 ${activeTab === "recorridos" ? "text-cyan-500" : "text-gray-500"}`} />
            <span className={`text-xs ${activeTab === "recorridos" ? "font-medium" : "text-gray-500"}`}>Recorridos y Paisajes</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveTab("historias")}>
            <Book className={`w-8 h-8 mb-1 ${activeTab === "historias" ? "text-cyan-500" : "text-gray-500"}`} />
            <span className={`text-xs ${activeTab === "historias" ? "font-medium" : "text-gray-500"}`}>Historias y Cultura Local</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveTab("comodidades")}>
            <Wifi className={`w-8 h-8 mb-1 ${activeTab === "comodidades" ? "text-cyan-500" : "text-gray-500"}`} />
            <span className={`text-xs ${activeTab === "comodidades" ? "font-medium" : "text-gray-500"}`}>Comodidades Extra</span>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button onClick={() => navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9')} className="bg-cyan-500 hover:bg-cyan-600" size="lg">
            Descubre todos nuestros servicios
          </Button>
        </div>
      </div>
    </section>
  );
};

// Extracted component for displaying the content of each category
const CategoryContent = ({ category }) => {
  return (
    <>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-display font-semibold text-cyan-500 mb-2">
          {category.title}
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {category.description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {category.items.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-start mb-4">
                  <div className="mr-4 text-cyan-500">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-semibold mb-2">{item.title}</h4>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{item.details}</p>
                    </div>
                    <div className="mt-3 text-right">
                      <span className="text-sm font-semibold text-cyan-500">
                        Incluido en tu estadía
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Benefits;
