import React from 'react';
import { ProductionReadinessTest } from '@/components/testing/ProductionReadinessTest';
import { ReservationFlowTest } from '@/components/testing/ReservationFlowTest';

const ProductionTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Panel de Testing - TreePod Glamping
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Esta página permite verificar que todos los sistemas estén funcionando correctamente 
            antes del lanzamiento a producción. Todos los tests deben pasar para garantizar 
            una experiencia óptima para los usuarios.
          </p>
        </div>
        
        <div className="space-y-8">
          <ProductionReadinessTest />
          <ReservationFlowTest />
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Esta página es solo para testing y no estará disponible en producción</p>
        </div>
      </div>
    </div>
  );
};

export default ProductionTest;