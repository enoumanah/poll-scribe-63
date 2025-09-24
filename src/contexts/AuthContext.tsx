import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI, tokenManager } from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: { username: string } | null;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface DecodedToken {
  sub: string; // Subject, which is the username
  iat: number; // Issued at
  exp: number; // Expiration time
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [token, setToken] = useState<string | null>(tokenManager.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({ username: decodedToken.sub });
        } else {
          tokenManager.removeToken();
          setToken(null);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        tokenManager.removeToken();
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials: any) => {
    const response = await authAPI.login(credentials);
    setToken(response.token);
    // Directly set user from the API response
    setUser({ username: response.username }); 
  };

  const register = async (userData: any) => {
    const response = await authAPI.register(userData);
    setToken(response.token);
    // Directly set user from the API response
    setUser({ username: response.username });
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token;

  if (loading) {
    return <div>Loading application...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};