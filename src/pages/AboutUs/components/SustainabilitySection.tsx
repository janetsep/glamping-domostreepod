import React from "react";
import { Droplets, Leaf, Utensils } from "lucide-react";
import { aboutUsContent } from "@/data/content/aboutUs";
const SustainabilitySection = () => {
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-4">
            {aboutUsContent.servicesTitle}
          </h2>
        </div>
        
        
      </div>
    </section>;
};
export default SustainabilitySection;