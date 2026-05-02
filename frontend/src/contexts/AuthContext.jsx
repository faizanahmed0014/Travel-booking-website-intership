import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('travel_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('travel_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const saveSession = (tokenValue, userData) => {
    localStorage.setItem('travel_token', tokenValue);
    localStorage.setItem('travel_user', JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  };

  const clearSession = () => {
    localStorage.removeItem('travel_token');
    localStorage.removeItem('travel_user');
    setToken('');
    setUser(null);
  };

  const login = async (credentials) => {
    setLoading(true);
    const response = await api.post('/auth/login', credentials);
    saveSession(response.data.token, response.data.user);
    setLoading(false);
    return response.data;
  };

  const adminLogin = async (credentials) => {
    setLoading(true);
    const response = await api.post('/auth/admin/login', credentials);
    saveSession(response.data.token, response.data.user);
    setLoading(false);
    return response.data;
  };

  const register = async (payload) => {
    setLoading(true);
    const response = await api.post('/auth/register', payload);
    saveSession(response.data.token, response.data.user);
    setLoading(false);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, adminLogin, register, logout: clearSession, api }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
