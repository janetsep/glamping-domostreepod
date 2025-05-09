
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  BrowserRouter,
} from "react-router-dom";
import App from "./App";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ScrollToTop } from "./App";

// We will use BrowserRouter instead of RouterProvider to avoid nesting routers
function Router() {
  // Handle hash navigation when the page loads or changes
  useEffect(() => {
    const handleHashChange = () => {
      // Check if there's a hash in the URL
      if (window.location.hash) {
        // Extract the ID from the hash
        const id = window.location.hash.substring(1);
        // Find the element by ID
        const element = document.getElementById(id);
        // If the element exists, scroll to it
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    // Handle hash on initial load
    handleHashChange();

    // Clean up the event listener
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default Router;
