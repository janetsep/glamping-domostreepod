
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/footer';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0e0f11] dark:text-white transition-colors duration-300">
      <Navigation />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
