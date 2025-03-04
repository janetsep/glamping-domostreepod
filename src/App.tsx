
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';
import Navigation from './components/Navigation';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0e0f11] dark:text-white transition-colors duration-300">
      <Navigation />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
