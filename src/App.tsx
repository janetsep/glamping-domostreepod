
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/footer';
import Index from './pages/Index';
import AboutUs from './pages/AboutUs';
import UnitDetail from './pages/UnitDetail';
import WebPayReturn from './pages/WebPayReturn';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-white dark:bg-[#0e0f11] dark:text-white transition-colors duration-300">
    <Navigation />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><Index /></AppLayout>} />
      <Route path="/about" element={<AppLayout><AboutUs /></AppLayout>} />
      <Route path="/unit/:unitId" element={<AppLayout><UnitDetail /></AppLayout>} />
      <Route path="/webpay/return" element={<AppLayout><WebPayReturn /></AppLayout>} />
      <Route path="/auth" element={<AppLayout><Auth /></AppLayout>} />
      <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
    </Routes>
  );
};

export default App;
