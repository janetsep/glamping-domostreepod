
import React from "react";
import { CategoryData } from "./types";

interface CategoryContentProps {
  category: CategoryData;
}

export const CategoryContent = ({ category }: CategoryContentProps) => {
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
        {category.items.map((item, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="h-64 relative overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              
              {/* Overlay with title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-xl font-display font-bold text-white">{item.title}</h4>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="mr-4 text-cyan-500">
                  {item.icon}
                </div>
                <div>
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
        ))}
      </div>
    </>
  );
};
