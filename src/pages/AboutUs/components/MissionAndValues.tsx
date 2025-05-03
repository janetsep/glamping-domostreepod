
import React from "react";
import { Heart, TreePine, Sparkles } from "lucide-react";
import { aboutUsContent } from "@/data/content/aboutUs";

const MissionAndValues = () => {
  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-4">
            {aboutUsContent.missionTitle}
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            {aboutUsContent.missionSubtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <TreePine className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-display font-bold">{aboutUsContent.valueTitle1}</h3>
            </div>
            <p className="text-gray-700">
              {aboutUsContent.valueText1}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-display font-bold">{aboutUsContent.valueTitle2}</h3>
            </div>
            <p className="text-gray-700">
              {aboutUsContent.valueText2}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Sparkles className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-display font-bold">{aboutUsContent.valueTitle3}</h3>
            </div>
            <p className="text-gray-700">
              {aboutUsContent.valueText3}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionAndValues;
