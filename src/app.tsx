import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Index from './components/Index';
import Login from './auth/Login';

function AppContent() {
  const location = useLocation();

  const hideHeaderOnRoutes = ['/login']; // rotas onde não exibe o header
  const shouldShowHeader = !hideHeaderOnRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && (
        <header className='bg-[#0d58c9] text-white p-4'>
          <img src="/assets/images/Logo.png" alt="Logo" className="h-12"/>
        </header>
      )}

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
