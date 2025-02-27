
import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import UnitDetail from "@/pages/UnitDetail";
import WebPayReturn from "@/pages/WebPayReturn";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/unit/:id",
    element: <UnitDetail />,
  },
  {
    path: "/webpay/return",
    element: <WebPayReturn />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
