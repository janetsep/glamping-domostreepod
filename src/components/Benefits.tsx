import { useState, useEffect } from "react";
import { BenefitsTabs } from "./benefits/BenefitsTabs";
import { experiencesData } from "./benefits/data";
import { useLocation } from "react-router-dom";
const Benefits = () => {
  const [activeTab, setActiveTab] = useState("recorridos");
  const location = useLocation();

  // Check if there's a hash parameter in the URL for selecting a specific tab
  useEffect(() => {
    const hash = location.hash;

    // If hash has a specific tab format like #benefits-recorridos
    if (hash.startsWith("#benefits-")) {
      const tabId = hash.replace("#benefits-", "");
      if (["recorridos", "historias", "bosque", "juegos"].includes(tabId)) {
        setActiveTab(tabId);
      }
    }
  }, [location.hash]);
  return <section id="benefits" className="py-10 bg-white">
      {/* Franja de título sin texto */}
      <div className="w-full bg-primary/5 border-b border-primary/10 py-3 mb-8">
        <div className="container mx-auto px-4">
          {/* Título removido de la franja */}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">Experiencias Eco-Luxury</h2>
        <p className="text-lg md:text-xl text-center text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">Conecta con la naturaleza a través de experiencias sostenibles y de lujo en el corazón del Valle Las Trancas. Aventura, relajación y confort premium en armonía con el medio ambiente.</p>
        
        {/* Tabs UI component */}
        <div className="mb-8">
          <BenefitsTabs experiencesData={experiencesData} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </section>;
};
export default Benefits;