
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CategoryIcons } from "./benefits/CategoryIcons";
import { BenefitsTabs } from "./benefits/BenefitsTabs";
import { experiencesData } from "./benefits/data";

const Benefits = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("banos");
  
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
        
        {/* Tabs UI component */}
        <div className="mb-8">
          <BenefitsTabs 
            experiencesData={experiencesData} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        </div>
        
        {/* Category Icons below tabs */}
        <CategoryIcons activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mt-12 text-center">
          <Button onClick={() => navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9')} className="bg-cyan-500 hover:bg-cyan-600" size="lg">
            Descubre todos nuestros servicios
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
