
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
          // Si el ID no parece un UUID válido, redirige a una unidad válida o a la página principal
          if (params.id && !isValidUUID(params.id)) {
            console.warn(`Invalid unit ID format: ${params.id}. Redirecting to valid unit.`);
            return { redirect: true, to: `/unit/${VALID_UNIT_ID}` };
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
  // Redirección para /unit/1 específicamente
  {
    path: 'unit/1',
    element: <Navigate to="/" replace />,
  },
]);
