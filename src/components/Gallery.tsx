
import { useEffect } from "react";

const Gallery = () => {
  // Initialize Elfsight widget when component mounts
  useEffect(() => {
    // Force reinitialization of the Elfsight widget
    if (window.elfsight && typeof window.elfsight.initialize === 'function') {
      window.elfsight.initialize();
    }
  }, []);
  
  return <section id="gallery" className="py-10 bg-white">
      {/* Franja de título sin texto */}
      <div className="w-full bg-primary/5 border-b border-primary/10 py-3 mb-8">
        <div className="container mx-auto px-4">
          {/* Título removido de la franja */}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">Galería</h2>
        <p className="text-xl text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Descubre las imágenes más hermosas de nuestros domos y el entorno natural que nos rodea
        </p>
        
        <div className="rounded-lg overflow-hidden shadow-lg">
          {/* Elfsight Gallery Widget */}
          <div className="elfsight-app-95014e6a-2fd5-4219-b0c5-e50cd23e4e72" data-elfsight-app-lazy></div>
        </div>
      </div>
    </section>;
};

export default Gallery;
