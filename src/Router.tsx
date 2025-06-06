
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import UnitDetail from "./pages/UnitDetail";
import TravelerType from "./pages/TravelerType";
import CelebrationDetail from "./pages/CelebrationDetail";
import { ReservationTest } from "./pages/ReservationTest";
import { useEffect } from "react";
import WebPayReturn from "./pages/WebPayReturn";
import { HelmetProvider } from "react-helmet-async";

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
    </Route>
  )
);

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
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export { router };
export default Router;
