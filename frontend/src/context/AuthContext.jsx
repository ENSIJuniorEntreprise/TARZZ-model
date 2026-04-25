import { createContext, useContext, useState, useEffect } from 'react';
import { auth as authApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);   // { email }
  const [loading, setLoading] = useState(true);

  // Vérifier le token au démarrage
  useEffect(() => {
    const token = localStorage.getItem('haj_token');
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then(data => setUser(data))
      .catch(() => localStorage.removeItem('haj_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('haj_token', data.token);
    setUser({ email: data.email });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('haj_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
