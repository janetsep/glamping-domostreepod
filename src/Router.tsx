
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import Index from './pages/Index';
import UnitDetail from './pages/UnitDetail';
import NotFound from './pages/NotFound';
import WebPayReturn from './pages/WebPayReturn';

// ID válido de ejemplo para redirección
const VALID_UNIT_ID = '48a7a330-ebae-4e79-8f53-31a84ac900d9';

// Función para verificar si un ID parece ser un UUID válido
const isValidUUID = (id: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: 'unit/:id',
        element: <UnitDetail />,
        loader: ({ params }) => {
          // Si el ID no parece un UUID válido, redirige directamente a la página principal
          if (params.id && !isValidUUID(params.id)) {
            console.warn(`Invalid unit ID format: ${params.id}. Redirecting to home page.`);
            return { redirect: true, to: `/` };
          }
          return null;
        },
      },
      {
        path: 'webpay/return',
        element: <WebPayReturn />,
      },
    ],
  },
  // Redirección directa y específica para unit/1
  {
    path: 'unit/1',
    element: <Navigate to="/" replace />,
  },
  // Redirección genérica para cualquier otra ruta unit/* que no sea un UUID válido
  {
    path: 'unit/*',
    loader: ({ params }) => {
      const path = params['*'];
      if (!isValidUUID(path)) {
        return { redirect: true, to: '/' };
      }
      return null;
    },
    element: <Navigate to="/" replace />,
  }
]);
