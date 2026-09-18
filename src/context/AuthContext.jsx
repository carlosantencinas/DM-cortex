import { createContext, useContext, useEffect, useState } from 'react';
import {
  browserPopupRedirectResolver,
  getRedirectResult,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let mounted = true;

    // Resolve a possible Google redirect when the user returns from Firebase.
    getRedirectResult(auth, browserPopupRedirectResolver).catch((err) => {
      console.error('Error al completar el inicio de sesión con Google:', err);
      if (mounted) setAuthError(err?.message || 'No se pudo completar el inicio de sesión.');
    });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!mounted) return;
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // GitHub Pages + popup was showing a blank Google/Firebase helper window in
  // some browsers. A full-page redirect avoids that popup DOM lifecycle and
  // returns to the SPA through public/404.html.
  const login = () => {
    setAuthError('');
    return signInWithRedirect(auth, googleProvider, browserPopupRedirectResolver);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
