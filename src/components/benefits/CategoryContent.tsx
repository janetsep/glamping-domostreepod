
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {category.items.map((item, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-64 relative overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            
            <div className="p-5">
              <div className="flex items-center mb-3">
                <div className="mr-3">{item.icon}</div>
                <h4 className="text-xl font-display font-bold text-gray-800">{item.title}</h4>
              </div>
              
              <p className="text-gray-600 mb-4">{item.description}</p>
              
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                {item.details}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
