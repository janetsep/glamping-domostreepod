
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
import { useEffect } from "react";
import WebPayReturn from "./pages/WebPayReturn";
import Auth from "./pages/Auth";

// Create the router with all our routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<NotFound />}>
      <Route index element={<Index />} />
      <Route path="about" element={<AboutUs />} />
      <Route path="sobre-nosotros" element={<AboutUs />} />
      <Route path="unit/:unitId" element={<UnitDetail />} />
      <Route path="webpay/return" element={<WebPayReturn />} />
      <Route path="auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
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

  return <RouterProvider router={router} />;
}

export { router };
export default Router;
