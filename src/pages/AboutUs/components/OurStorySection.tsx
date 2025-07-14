import React from "react";
import { aboutUsContent } from "@/data/content/aboutUs";
const OurStorySection = () => {
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-primary mb-6">
              {aboutUsContent.storyTitle}
            </h2>
            <p className="text-gray-700 mb-4">
              {aboutUsContent.storyText}
            </p>
            <p className="text-gray-700 mb-4">
              {aboutUsContent.storyText2}
            </p>
            <p className="text-gray-700">
              {aboutUsContent.storyText3}
            </p>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-4">
              
              
              
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default OurStorySection;