import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setAuthError('');
    if (!email || !password) {
      const error = new Error('Ingresa tu correo y contraseña.');
      error.code = 'auth/missing-fields';
      setAuthError(error.message);
      throw error;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      return credential.user;
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      const message =
        err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found'
          ? 'El correo o la contraseña no son correctos.'
          : err?.code === 'auth/too-many-requests'
            ? 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.'
            : err?.code === 'auth/user-disabled'
              ? 'Esta cuenta está deshabilitada. Contacta al administrador de DM Cortex.'
              : err?.message || 'No se pudo iniciar sesión.';
      setAuthError(message);
      throw err;
    }
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
