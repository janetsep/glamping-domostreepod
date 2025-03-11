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
import ReservationSearch from "./pages/ReservationSearch";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<NotFound />}>
      <Route index element={<Index />} />
      <Route path="sobre-nosotros" element={<AboutUs />} />
      <Route path="unit/:unitId" element={<UnitDetail />} />
      <Route path="webpay/return" element={<WebPayReturn />} />
      <Route path="/reservations/search" element={<ReservationSearch />} />
    </Route>
  )
);

function Router() {
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return <RouterProvider router={router} />;
}

export { router };
export default Router;
