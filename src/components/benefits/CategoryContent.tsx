
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8 justify-items-center">
        {category.items.map((item, index) => (
          <div 
            key={index} 
            className="relative rounded-lg overflow-hidden shadow-lg group transition-all duration-300 w-full max-w-xs"
          >
            <div className="h-72 relative overflow-hidden cursor-pointer flex items-center justify-center">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white/90 text-sm mb-3">{item.description}</p>
              </div>
            </div>
            
            <div className="p-4 bg-white">
              <h4 className="text-xl font-display font-bold">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
