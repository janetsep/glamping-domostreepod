import { useEffect } from 'react';

export const useElfsight = (widgetId: string, delay: number = 1000) => {
  useEffect(() => {
    const initializeWidget = () => {
      if (window.elfsight && typeof window.elfsight.initialize === 'function') {
        console.log(`🔧 ELFSIGHT: ✅ Inicializando widget ${widgetId}`);
        try {
          window.elfsight.initialize();
        } catch (error) {
          console.log(`🔧 ELFSIGHT: ❌ Error en widget ${widgetId}:`, error);
        }
      } else {
        console.log(`🔧 ELFSIGHT: ⏳ Platform no disponible para ${widgetId}, reintentando...`);
        setTimeout(initializeWidget, 500);
      }
    };

    // Initialize after component mounts
    const timer = setTimeout(initializeWidget, delay);

    return () => clearTimeout(timer);
  }, [widgetId, delay]);
};

declare global {
  interface Window {
    elfsight?: {
      initialize: () => void;
    };
  }
}