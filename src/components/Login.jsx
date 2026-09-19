import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) return <Navigate to="/personaje" replace />;

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loggingIn) return;

    setLoggingIn(true);
    try {
      await login(email, password);
    } catch {
      // AuthContext provides the user-friendly error message.
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-glow" />
      <div className="login-card">
        <div className="brand-mark">◆</div>
        <div className="eyebrow">D&D 5.5e · Mesa digital</div>
        <h1>DM CORTEX</h1>
        <p>Tu hoja de personaje, tu campaña y tu mesa de juego en un solo lugar.</p>

        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="login-email">Correo electrónico</label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu-correo@ejemplo.com"
            required
          />

          <label htmlFor="login-password">Contraseña</label>
          <div className="password-field">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Tu contraseña"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>

          {authError && <div className="login-error" role="alert">{authError}</div>}

          <button type="submit" disabled={loggingIn} className="btn-primary login-button">
            {loggingIn ? 'Iniciando sesión…' : 'Entrar a DM Cortex'}
          </button>
        </form>

        <small>Tu cuenta es creada y administrada por el DM desde Firebase Authentication.</small>
      </div>
    </div>
  );
}
