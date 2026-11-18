import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/api.js';
import { STORAGE_KEYS } from '../constants/index.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) { setLoading(false); return; }

    authService.me()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((userData, token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch (_) {}
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  }, []);

  const updateUser = useCallback((userData) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const isStudent = user && ['student', 'graduate', 'job_seeker'].includes(user.role);
  const isEmployer = user?.role === 'employer';
  const isAdmin = user && ['admin', 'super_admin'].includes(user.role);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      updateUser,
      isAuthenticated: !!user,
      isStudent,
      isEmployer,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
