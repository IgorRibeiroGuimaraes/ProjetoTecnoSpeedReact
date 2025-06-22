import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Index from './components/Index';
import Login from './auth/Login';
import Navbar from './components/Navbar'; 
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();

  const hideHeaderOnRoutes = ['/login']; // Rotas onde não exibe o header
  const shouldShowHeader = !hideHeaderOnRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Index />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="bg-white/10 backdrop-blur-lg text-white border border-white/20 rounded-xl shadow-lg p-4"
      />
    </>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}