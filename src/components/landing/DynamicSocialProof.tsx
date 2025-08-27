import { Heart, Star, Quote, Camera } from "lucide-react";
import { useGlampingStats, useTestimonials } from "@/hooks/useGlampingData";
export const DynamicSocialProof = () => {
  const {
    data: stats,
    isLoading: statsLoading
  } = useGlampingStats();
  const {
    data: testimonials,
    isLoading: testimonialsLoading
  } = useTestimonials();
  if (statsLoading || testimonialsLoading) {
    return <section className="py-16 bg-gradient-to-br from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[1, 2, 3, 4].map(i => <div key={i} className="text-center animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
              </div>)}
          </div>
        </div>
      </section>;
  }
  return;
};