import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App";
import SobreNosotros from "./pages/SobreNosotros";
import ErrorPage from "./pages/ErrorPage";
import Footer from "./components/footer";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route path="sobre-nosotros" element={<SobreNosotros />} />
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
