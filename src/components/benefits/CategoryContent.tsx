
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {category.items.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-start mb-4">
                  <div className="mr-4 text-cyan-500">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-semibold mb-2">{item.title}</h4>
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
          </div>
        ))}
      </div>
    </>
  );
};
