import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('aerofetch_token');
    if (!token) { setLoading(false); return; }
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data.user);
    } catch {
      localStorage.removeItem('aerofetch_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('aerofetch_token', res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (email, password, name) => {
    const res = await api.post('/api/auth/register', { email, password, name });
    localStorage.setItem('aerofetch_token', res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try { await api.post('/api/auth/logout'); } catch { }
    localStorage.removeItem('aerofetch_token');
    setUser(null);
  };

  const loginWithGoogle = async (credential) => {
    const res = await api.post('/api/auth/google', { credential });
    localStorage.setItem('aerofetch_token', res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
