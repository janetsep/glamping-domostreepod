
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WebPayReturn from "./pages/WebPayReturn";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UnitDetail from "./pages/UnitDetail";
import AboutUs from "./pages/AboutUs";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
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
    path: "/sobre-nosotros",
    element: <AboutUs />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const Router = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
};

export default Router;
