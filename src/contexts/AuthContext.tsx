import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, tokenManager } from '@/services/api';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenManager.getToken();
      if (token) {
        try {
          // Decode the token to get the real user's username
          const decodedToken: { sub: string } = jwtDecode(token);
          const username = decodedToken.sub;
  
          // Set the user state with the correct username
          setUser({ id: 'me', username: username, email: '' }); 
        } catch (error) {
          console.error("Invalid token:", error);
          tokenManager.removeToken(); // Clear the invalid token
          setUser(null);
        }
      }
      setIsLoading(false);
    };
  
    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('AuthContext: Starting login...');
      const response = await authAPI.login({ username, password });
      console.log('AuthContext: Login response:', response);
      // Set user from response or create fallback user object
      const user = response.user || { id: 'me', username, email: '' };
      setUser(user);
      console.log('AuthContext: User set:', user);
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('AuthContext: Starting registration...');
      const response = await authAPI.register({ username, email, password });
      console.log('AuthContext: Registration response:', response);
      // Set user from response or create fallback user object
      const user = response.user || { id: 'me', username, email };
      setUser(user);
      console.log('AuthContext: User set:', user);
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user || tokenManager.isAuthenticated(),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};