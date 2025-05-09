
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import DomoList from "./pages/DomoList";
import UnitDetail from "./pages/UnitDetail";
import TravelerType from "./pages/TravelerType";
import WebpayReturn from "./pages/WebpayReturn";
import { Toaster } from "./components/ui/toaster";
import { useEffect } from "react";
import { Toaster as SonnerToaster } from "sonner";
import FloatingReserveButton from "./components/navigation/FloatingReserveButton";

// Componente para manejar el botón flotante y la lógica de navegación
const FloatingButtonHandler = () => {
  const location = useLocation();
  
  // Determinar si estamos en una página de detalle de unidad o webpay
  // En estas páginas, no queremos mostrar el botón flotante
  const isUnitDetailPage = location.pathname.includes('/unit/');
  const isWebpayPage = location.pathname.includes('/webpay/');
  
  // No mostrar el botón si estamos en estas páginas
  if (isUnitDetailPage || isWebpayPage) {
    return null;
  }
  
  return <FloatingReserveButton />;
};

// Componente para manejar el scroll al cambiar de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/domos" element={<DomoList />} />
          <Route path="/unit/:unitId" element={<UnitDetail />} />
          <Route path="/tipo-viajero/:typeId" element={<TravelerType />} />
          <Route path="/webpay/return" element={<WebpayReturn />} />
        </Routes>
        <FloatingButtonHandler />
        <Toaster />
        <SonnerToaster position="top-right" expand={false} richColors />
      </Layout>
    </Router>
  );
}

export default App;
