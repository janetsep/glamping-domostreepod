
import React from "react";
import { Droplets, Leaf, Utensils } from "lucide-react";
import { aboutUsContent } from "@/data/content/aboutUs";

const SustainabilitySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-4">
            {aboutUsContent.servicesTitle}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="/images/locations/tinaja-bosque.jpg" 
              alt="Tinajas de ciprés con agua mineralizada" 
              className="rounded-lg shadow-lg w-full h-[500px] object-cover"
            />
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="flex items-center mb-2">
                <Droplets className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                <h3 className="text-xl font-display font-bold">Baños Mineralizados</h3>
              </div>
              <p className="text-gray-700 pl-8">
                {aboutUsContent.servicesText1}
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Utensils className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                <h3 className="text-xl font-display font-bold">Gastronomía Local</h3>
              </div>
              <p className="text-gray-700 pl-8">
                {aboutUsContent.servicesText2}
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Leaf className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                <h3 className="text-xl font-display font-bold">Espacios para Compartir</h3>
              </div>
              <p className="text-gray-700 pl-8">
                {aboutUsContent.servicesText3}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
