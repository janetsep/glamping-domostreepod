
import { useElfsight } from '@/hooks/useElfsight';

const Gallery = () => {
  // Force Elfsight initialization for gallery widget
  useElfsight('95014e6a-2fd5-4219-b0c5-e50cd23e4e72', 1000);
  
  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Galería</h2>
          <p className="section-description">
            Descubre las imágenes más hermosas de nuestros domos y el entorno natural que nos rodea.
          </p>
        </div>
        
        {/* Widget Elfsight */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="elfsight-app-95014e6a-2fd5-4219-b0c5-e50cd23e4e72" data-elfsight-app-lazy></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
