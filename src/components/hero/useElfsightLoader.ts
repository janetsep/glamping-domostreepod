import { useEffect } from "react";

// Declaración para TypeScript
declare global {
  interface Window {
    elfsight?: {
      initialize: () => void;
    };
  }
}

export const useElfsightLoader = () => {
  useEffect(() => {
    // Check if the script is already added to prevent duplicates
    if (!document.querySelector('script[src="https://static.elfsight.com/platform/platform.js"]')) {
      const script = document.createElement('script');
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Manually trigger Elfsight to load widgets if their platform JS is already loaded
    if (window.elfsight) {
      window.elfsight.initialize();
    }
  }, []);
};
