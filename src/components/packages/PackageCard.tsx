
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

export interface PackageAmenity {
  icon: React.ReactNode;
  text: string;
}

export interface PackageItem {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  price: number;
  originalPrice: number;
  image: string;
  interiorImage: string;
  size: string;
  maxGuests: number;
  features: string[];
  amenities: PackageAmenity[];
}

interface PackageCardProps {
  pkg: PackageItem;
  hoveredUnit: string | null;
  expandedUnit: string | null;
  setHoveredUnit: (id: string | null) => void;
  toggleExpandUnit: (id: string, event: React.MouseEvent) => void;
  handleUnitClick: (id: string) => void;
}

const PackageCard = ({ 
  pkg, 
  hoveredUnit, 
  expandedUnit, 
  setHoveredUnit, 
  toggleExpandUnit, 
  handleUnitClick 
}: PackageCardProps) => {
  return (
    <div 
      key={pkg.id} 
      className={`relative rounded-lg overflow-hidden shadow-lg group transition-all duration-300 ${
        expandedUnit === pkg.id ? 'md:col-span-3 md:row-span-2 md:h-auto' : ''
      }`}
      onMouseEnter={() => !expandedUnit && setHoveredUnit(pkg.id)}
      onMouseLeave={() => !expandedUnit && setHoveredUnit(null)}
    >
      {expandedUnit === pkg.id ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-display font-bold text-primary">{pkg.title}</h3>
              <button 
                onClick={(e) => toggleExpandUnit(pkg.id, e)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-700">{pkg.detailedDescription}</p>
            
            <div className="flex items-center text-gray-700 font-medium">
              <Users size={18} className="mr-2" />
              <span>Capacidad: {pkg.maxGuests} personas</span>
              <span className="mx-3">•</span>
              <span>{pkg.size}</span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Amenidades</h4>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {pkg.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 text-primary">{amenity.icon}</span>
                    {amenity.text}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-end pt-4">
              <div>
                <span className="text-gray-500 line-through text-sm">
                  ${pkg.originalPrice.toLocaleString()}
                </span>
                <div className="text-xl font-bold text-primary">
                  ${pkg.price.toLocaleString()}
                </div>
              </div>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnitClick(pkg.id);
                }}
                className="bg-accent hover:bg-accent/90 flex items-center gap-2"
              >
                Reservar ahora
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="h-64 overflow-hidden rounded-lg">
              <img 
                src={pkg.image} 
                alt={`Exterior de ${pkg.title}`} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-64 overflow-hidden rounded-lg">
              <img 
                src={pkg.interiorImage} 
                alt={`Interior de ${pkg.title}`} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="cursor-pointer relative"
          onClick={() => handleUnitClick(pkg.id)}
        >
          <div className="h-72 relative">
            <img 
              src={pkg.image} 
              alt={pkg.title} 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">{pkg.title}</h3>
                <p className="text-white/90 text-sm">{pkg.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-white/80 text-sm">
                  <Users size={16} className="mr-1" />
                  <span>Hasta {pkg.maxGuests} personas</span>
                </div>
                
                <div>
                  <span className="text-white/70 line-through text-sm block">
                    ${pkg.originalPrice.toLocaleString()}
                  </span>
                  <div className="text-xl font-bold text-white">
                    ${pkg.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageCard;
