
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import Footer from "./components/footer";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<NotFound />}>
      <Route index element={<AboutUs />} />
      <Route path="sobre-nosotros" element={<AboutUs />} />
    </Route>
  )
);

function Router() {
  return (
    <>
      <RouterProvider router={router} />
      <Footer />
    </>
  );
}

export default Router;
