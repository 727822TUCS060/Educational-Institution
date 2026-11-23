import { createContext, useContext, useEffect } from 'react';
import { apiPost } from '../api';
import { useLocalStorage } from '../lib';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // { token, user } – saved in the browser so a refresh keeps you logged in
  const [session, setSession] = useLocalStorage('edu_session', null);
  const user = session && session.user ? session.user : null;
  const token = session && session.token ? session.token : null;

  // Quietly confirm the saved session is still valid (sessions last about 6 hours)
  useEffect(() => {
    if (!token) return;
    apiPost('me', {}, token).catch((err) => {
      if (/session expired/i.test(err.message)) setSession(null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiPost('login', { email, password });
      setSession({ token: res.token, user: res.user });
      return { ok: true, user: res.user };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  // role: 'student' | 'owner'  (owner needs the secret owner code set in the Apps Script)
  const register = async ({ name, email, phone, password, role, ownerCode }) => {
    try {
      const res = await apiPost('register', { name, email, phone, password, role, ownerCode });
      setSession({ token: res.token, user: res.user });
      return { ok: true, user: res.user };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const logout = () => {
    if (token) apiPost('logout', {}, token).catch(() => {});
    setSession(null);
  };

  const value = { user, token, login, register, logout, isOwner: user?.role === 'owner' };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
