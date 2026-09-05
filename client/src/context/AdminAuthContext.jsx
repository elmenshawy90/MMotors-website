import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminLogin, adminVerify, getAdminToken, setAdminToken } from '../services/api';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => getAdminToken());
  const [username, setUsername] = useState(null);
  const [checking, setChecking] = useState(!!getAdminToken());

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setChecking(false);
      return undefined;
    }
    adminVerify()
      .then((res) => {
        if (cancelled) return;
        setUsername(res.data.data.username);
        setChecking(false);
      })
      .catch(() => {
        if (cancelled) return;
        setAdminToken(null);
        setToken(null);
        setUsername(null);
        setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async (usernameInput, password) => {
    const res = await adminLogin({ username: usernameInput, password });
    const data = res.data.data;
    setAdminToken(data.token);
    setToken(data.token);
    setUsername(data.username);
    return data;
  }, []);

  const logout = useCallback(() => {
    setAdminToken(null);
    setToken(null);
    setUsername(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated: !!token, username, checking, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated, checking } = useContext(AdminAuthContext);
  const location = useLocation();

  if (checking) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used inside an AdminAuthProvider');
  }
  return context;
}