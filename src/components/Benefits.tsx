
import { useState } from "react";
import { BenefitsTabs } from "./benefits/BenefitsTabs";
import { experiencesData } from "./benefits/data";

const Benefits = () => {
  const [activeTab, setActiveTab] = useState("tinajas");

  return (
    <section id="benefits" className="py-10 bg-white">
      {/* Franja de título sin texto */}
      <div className="w-full bg-primary/5 border-b border-primary/10 py-3 mb-8">
        <div className="container mx-auto px-4">
          {/* Título removido de la franja */}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">Experiencias</h2>
        <p className="text-xl text-center text-gray-600 mb-8 max-w-3xl mx-auto">Explora, relájate y saborea lo mejor de Valle Las Trancas con nuestras actividades pensadas para disfrutar el entorno.</p>
        
        {/* Tabs UI component */}
        <div className="mb-8">
          <BenefitsTabs experiencesData={experiencesData} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </section>
  );
};

export default Benefits;
