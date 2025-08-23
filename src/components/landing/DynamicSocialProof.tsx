import { Heart, Star, Quote, Camera } from "lucide-react";
import { useGlampingStats, useTestimonials } from "@/hooks/useGlampingData";

export const DynamicSocialProof = () => {
  const { data: stats, isLoading: statsLoading } = useGlampingStats();
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials();

  if (statsLoading || testimonialsLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Experiencias Reales
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Lo que dicen nuestros huéspedes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experiencias reales de quienes han disfrutado de la magia de TreePod
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {stats?.totalGuests || 0}+
            </div>
            <div className="text-sm text-muted-foreground">
              Huéspedes Felices
            </div>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {stats?.averageRating || 5.0}/5
            </div>
            <div className="text-sm text-muted-foreground">
              Calificación Promedio
            </div>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Quote className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {stats?.recommendationRate || 95}%
            </div>
            <div className="text-sm text-muted-foreground">
              Recomendarían TreePod
            </div>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {stats?.photosShared || 0}+
            </div>
            <div className="text-sm text-muted-foreground">
              Fotos Compartidas
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials?.slice(0, 3).map((testimonial, index) => (
            <div key={testimonial.id || index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-bold text-lg">
                    {testimonial.name ? testimonial.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-foreground">
                    {testimonial.name || 'Usuario Verificado'}
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  {testimonial.verified && (
                    <div className="text-xs text-primary font-medium">
                      Huésped Verificado
                    </div>
                  )}
                </div>
              </div>
              
              <Quote className="w-6 h-6 text-primary/30 mb-2" />
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {testimonial.comment || "Experiencia increíble en TreePod. Todo superó nuestras expectativas."}
              </p>
              
              {testimonial.location && (
                <div className="text-xs text-muted-foreground">
                  {testimonial.location}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};