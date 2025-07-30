
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import UnitDetail from "./pages/UnitDetail";
import TravelerType from "./pages/TravelerType";
import CelebrationDetail from "./pages/CelebrationDetail";
import { ReservationTest } from "./pages/ReservationTest";
import ProductionTest from "./pages/ProductionTest";
import WebPayReturn from "./pages/WebPayReturn";

// Create the router with all our routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<NotFound />}>
      <Route index element={<Index />} />
      <Route path="sobre-nosotros" element={<AboutUs />} />
      <Route path="unit/:unitId" element={<UnitDetail />} />
      <Route path="tipo-viajero/:typeId" element={<TravelerType />} />
      <Route path="celebracion/:id" element={<CelebrationDetail />} />
      <Route path="webpay/return" element={<WebPayReturn />} />
      <Route path="demo-reservas" element={<ReservationTest />} />
      <Route path="production-test" element={<ProductionTest />} />
    </Route>
  )
);

function Router() {
  // Handle hash navigation when the page loads or changes
  useEffect(() => {
    const handleHashNavigation = () => {
      // Check if there's a hash in the URL
      if (window.location.hash) {
        // Extract the ID from the hash
        const id = window.location.hash.substring(1);
        // Find the element by ID
        const element = document.getElementById(id);
        // If the element exists, scroll to it
        if (element) {
          // Longer delay to ensure the page has fully loaded
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      }
    };

    // Handle hash navigation on route changes and hash changes
    const handleRouteChange = () => {
      // Small delay to ensure DOM is updated after route change
      setTimeout(handleHashNavigation, 100);
    };

    // Add event listeners
    window.addEventListener('hashchange', handleHashNavigation);
    window.addEventListener('popstate', handleRouteChange);
    
    // Handle hash on initial load and route changes
    handleHashNavigation();

    // Clean up the event listeners
    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export { router };
export default Router;
