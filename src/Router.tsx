
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Index from './pages/Index';
import UnitDetail from './pages/UnitDetail';
import NotFound from './pages/NotFound';
import WebPayReturn from './pages/WebPayReturn';

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
      },
      {
        path: 'webpay/return',
        element: <WebPayReturn />,
      },
    ],
  },
]);
