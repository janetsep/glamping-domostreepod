
import React from "react";
import { Section } from "@/components/ui/Section";
import { aboutUsContent } from "@/data/content/aboutUs";

const ReforestationProject = () => {
  return (
    <Section 
      title={aboutUsContent.regenerativeTitle}
      subtitle=""
      className="bg-primary/5 py-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-700">{aboutUsContent.regenerativeText1}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-700">{aboutUsContent.regenerativeText2}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-700">{aboutUsContent.regenerativeText3}</p>
          </div>
        </div>
        <div className="flex justify-center">
          <img 
            src="/images/locations/reforestation-project.jpg" 
            alt="Proyecto de reforestación en Valle Las Trancas" 
            className="rounded-lg shadow-lg w-full max-w-md object-cover h-[500px]"
          />
        </div>
      </div>
    </Section>
  );
};

export default ReforestationProject;
