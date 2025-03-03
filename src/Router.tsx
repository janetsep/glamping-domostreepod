
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

// Create the router with all our routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<NotFound />}>
      <Route index element={<Index />} />
      <Route path="sobre-nosotros" element={<AboutUs />} />
      <Route path="unit/:unitId" element={<UnitDetail />} />
    </Route>
  )
);

function Router() {
  return <RouterProvider router={router} />;
}

export { router };
export default Router;
