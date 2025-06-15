import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useLocation } from 'react-router-dom'; // Adicione useLocation
import { login as apiLogin, checkAuth, logout as apiLogout } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { cnpj: string } | null;
  login: (cnpj: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ cnpj: string } | null>(null);
  const location = useLocation(); // Obtém a rota atual

  useEffect(() => {
    const verifyAuth = async () => {
      // Não verifica autenticação na rota /login
      if (location.pathname === '/login') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await checkAuth();
        console.log('Auth check response:', response);
        setIsAuthenticated(response.isAuthenticated);
        setUser(response.isAuthenticated ? response.user : null);
      } catch (error) {
        console.error('Failed to check auth:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, [location.pathname]); // Adicione location.pathname como dependência

  const loginAuth = async (cnpj: string, senha: string) => {
    await apiLogin(cnpj, senha);
    const response = await checkAuth();
    setIsAuthenticated(response.isAuthenticated);
    setUser(response.isAuthenticated ? response.user : null);
  };

  const logout = async () => {
    await apiLogout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login: loginAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};