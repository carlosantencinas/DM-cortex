import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login(){
  const {user,login}=useAuth();
  const [error,setError]=useState('');
  const [loggingIn,setLoggingIn]=useState(false);

  if(user)return <Navigate to="/personaje" replace/>;

  const handleLogin = async () => {
    if(loggingIn) return;
    setError('');
    setLoggingIn(true);
    try {
      await login();
    } catch (err) {
      console.error('Error de inicio de sesión con Google:', err);
      setError(
        err?.code === 'auth/unauthorized-domain'
          ? 'Este dominio de GitHub Pages todavía no está autorizado en Firebase Authentication. Agrega carlosantencinas.github.io en Firebase → Authentication → Settings → Authorized domains.'
          : err?.code === 'auth/popup-blocked'
            ? 'El navegador bloqueó la ventana de Google. Permite ventanas emergentes para esta página e inténtalo de nuevo.'
            : err?.message || 'No se pudo iniciar sesión con Google.'
      );
    } finally {
      setLoggingIn(false);
    }
  };

  return <div className="login-screen"><div className="login-glow"/><div className="login-card"><div className="brand-mark">◆</div><div className="eyebrow">D&D 5.5e · Mesa digital</div><h1>DM CORTEX</h1><p>Tu hoja de personaje, tu campaña y tu mesa de juego en un solo lugar.</p><button onClick={handleLogin} disabled={loggingIn} className="btn-primary login-button"><span>G</span> {loggingIn ? 'Abriendo Google…' : 'Continuar con Google'}</button>{error && <div className="login-error" role="alert">{error}</div>}<small>Sin contraseñas adicionales. Tu progreso se sincroniza con la campaña.</small></div></div>;
}
