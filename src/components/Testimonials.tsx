import { useElfsight } from '@/hooks/useElfsight';

const Testimonials = () => {
  // Force Elfsight initialization for this widget
  useElfsight('58776635-7259-470b-9077-f838d052ebab', 1500);

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">¡Los Huéspedes Opinan!</h2>
          <p className="section-description">
            Comentarios reales de huéspedes que han vivido la experiencia TreePod.
          </p>
        </div>
        
        {/* Widget Elfsight */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="elfsight-app-58776635-7259-470b-9077-f838d052ebab" data-elfsight-app-lazy></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;