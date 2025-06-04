
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

const WomenRelaxSection = () => {
  const [activeTab, setActiveTab] = useState("que-incluye");

  const tabs = [
    {
      id: "que-incluye",
      name: "Qué Incluye",
      title: "¿Qué Incluye el Paquete?",
      content: "Diseñado especialmente para mujeres que buscan un respiro en la naturaleza, compartiendo momentos especiales entre amigas, madre-hija, hermanas o simplemente tiempo personal. Un tiempo para ti en medio del bosque nativo.",
      image: "/lovable-uploads/ec4a0c77-c6b5-4ec7-a6ab-f2ef933494c3.png"
    },
    {
      id: "alojamiento",
      name: "Alojamiento",
      title: "Alojamiento en Domos TreePod",
      content: "Domo geodésico para hasta 4 personas con 1 cama matrimonial + 2 camas de 1 plaza, baño privado completo, calefacción para todas las estaciones, vista directa al bosque nativo y conexión Starlink disponible para quienes la necesiten.",
      image: "/lovable-uploads/7f6ccade-6dee-4a0c-9e1c-689a1a923b73.png"
    },
    {
      id: "experiencias",
      name: "Experiencias",
      title: "Experiencias Incluidas",
      content: "Piscina de agua fría del río Chillán con propiedades minerales, 1 hora de tinajas de ciprés con agua mineralizada incluida, picoteo gourmet con productos del invernadero, jugos naturales y smoothies frescos, espumante de bienvenida, infusiones especiales y terraza con mobiliario para charlar al aire libre bajo las estrellas.",
      image: "/lovable-uploads/5bf3bb3b-da31-4f12-a031-1d7274b2b1cc.png"
    },
    {
      id: "alimentacion",
      name: "Alimentación",
      title: "Alimentación del Invernadero",
      content: "Alimentación completa con productos frescos del invernadero propio: desayuno con productos frescos, almuerzo campestre con verduras y hierbas del huerto, cena con ingredientes locales y de temporada, y snacks saludables disponibles durante el día.",
      image: "/lovable-uploads/ed56aab2-6ded-4bab-a2ab-2471f2fc6442.png"
    },
    {
      id: "precios",
      name: "Precios",
      title: "Precios y Opciones",
      content: "Paquete Mujeres al Descanso y Relax (2 noches, viernes a domingo): Domo completo hasta 4 personas por $520.000 CLP. Servicios adicionales opcionales: hora extra de tinajas $25.000, cena especial $25.000 por persona, kit de picnic $15.000 por grupo, transporte desde Las Trancas $12.000 por viaje.",
      image: "/lovable-uploads/258111ea-9c35-4f22-811b-3beaeba46f33.png"
    },
    {
      id: "incluye",
      name: "Lo que Incluye",
      title: "Lo que Incluye Cada Paquete",
      content: "Alojamiento en domo geodésico completo (2 noches), todas las comidas + snacks con productos del invernadero, espumante de bienvenida + jugos + infusiones, acceso a piscina de agua mineralizada, 1 hora de tinajas de ciprés incluida, terraza con mobiliario para charlar al aire libre, estacionamiento y conexión Starlink disponible.",
      image: "/lovable-uploads/3c440bec-e9af-462b-95d8-45e8eec15b88.png"
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <Section
      id="women-relax"
      className="py-16 bg-pink-50"
    >
      <div className="container mx-auto px-4">
        {/* Título principal */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-primary mb-4">
            🌸 Mujeres al Descanso y Relax 🌸
          </h2>
          <p className="text-xl text-gray-600 italic">
            Un tiempo para ti en medio del bosque nativo
          </p>
        </div>

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
                      ? 'border-pink-400 text-pink-600 bg-white shadow-sm font-medium' 
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
              <h3 className="text-3xl font-display font-bold text-gray-900 mb-6">
                {activeTabData.title}
              </h3>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed font-serif text-base">
                  {activeTabData.content}
                </p>
              </div>

              {/* Información especial para precios */}
              {activeTab === "precios" && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-pink-200">
                  <h4 className="font-bold text-lg mb-4 text-pink-700">💰 Servicios Adicionales Opcionales</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Hora extra de tinajas</span>
                      <span className="font-medium">$25.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cena especial por persona</span>
                      <span className="font-medium">$25.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kit de picnic por grupo</span>
                      <span className="font-medium">$15.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transporte desde Las Trancas</span>
                      <span className="font-medium">$12.000</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Información especial para lo que incluye */}
              {activeTab === "incluye" && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-pink-200">
                  <h4 className="font-bold text-lg mb-4 text-pink-700">✅ Lista Completa</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✅</span>
                      <span>Alojamiento en domo geodésico completo (2 noches)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✅</span>
                      <span>Todas las comidas + snacks con productos del invernadero</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✅</span>
                      <span>Espumante de bienvenida + jugos + infusiones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✅</span>
                      <span>Acceso a piscina de agua mineralizada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✅</span>
                      <span>1 hora de tinajas de ciprés incluida</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✅</span>
                      <span>Terraza con mobiliario para charlar al aire libre</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✅</span>
                      <span>Estacionamiento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✅</span>
                      <span>Conexión Starlink disponible</span>
                    </li>
                  </ul>
                </div>
              )}
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

        {/* Sección adicional con información complementaria */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Perfecto para */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-pink-200">
            <h4 className="font-bold text-lg mb-4 text-pink-700">🎯 Perfecto Para:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Cumpleaños entre amigas</li>
              <li>• Tiempo madre-hija</li>
              <li>• Grupos de hermanas</li>
              <li>• Mujeres que necesitan tiempo personal</li>
              <li>• Despedidas de soltera naturales</li>
              <li>• Celebraciones sencillas pero especiales</li>
            </ul>
          </div>

          {/* Qué traer */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-pink-200">
            <h4 className="font-bold text-lg mb-4 text-pink-700">🎒 ¿Qué Traer?</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Ropa cómoda para actividades al aire libre</li>
              <li>• Traje de baño para la piscina</li>
              <li>• Calzado cómodo para caminar</li>
              <li>• Artículos de aseo personal</li>
            </ul>
          </div>

          {/* Condiciones */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-pink-200">
            <h4 className="font-bold text-lg mb-4 text-pink-700">📝 Condiciones:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Reserva con 48 horas de anticipación</li>
              <li>• Cancelación sin costo hasta 24 horas antes</li>
              <li>• 15% descuento para grupos que repiten</li>
              <li>• Válido todo el año (verificar disponibilidad)</li>
            </ul>
          </div>
        </div>

        {/* Testimonios */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-sm border border-pink-200">
          <h4 className="font-bold text-2xl mb-6 text-pink-700 text-center">🌟 Testimonios Reales</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="italic text-gray-700 mb-2">"Un lugar perfecto para charlar tranquilas y disfrutar la naturaleza sin complicaciones"</p>
              <p className="font-medium text-pink-600">- Andrea, 32 años</p>
            </div>
            <div className="text-center">
              <p className="italic text-gray-700 mb-2">"La piscina de agua fría fue una experiencia increíble, y la comida del invernadero deliciosa"</p>
              <p className="font-medium text-pink-600">- Patricia, 28 años</p>
            </div>
            <div className="text-center">
              <p className="italic text-gray-700 mb-2">"Ideal para descansar de verdad. Simple pero muy bien pensado"</p>
              <p className="font-medium text-pink-600">- Mónica, 35 años</p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-pink-400 to-pink-600 text-white p-8 rounded-lg shadow-lg">
            <h4 className="text-2xl font-bold mb-4">¡Reserva tu tiempo en la naturaleza!</h4>
            <p className="text-xl mb-6">Valle Las Trancas te espera 🌸</p>
            <button className="bg-white text-pink-600 px-8 py-3 rounded-lg font-bold hover:bg-pink-50 transition-colors">
              Reservar Ahora
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default WomenRelaxSection;
