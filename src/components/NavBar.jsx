import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  if (!user) return null;
  const active = path => location.pathname === path;

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand"><span className="brand-mark">🎲</span>DM CORTEX</Link>
      <nav className="navbar-links">
        <Link className={active('/') || active('/personajes') ? 'nav-active' : ''} to="/">Mis personajes</Link>
        <Link className={active('/campana') ? 'nav-active' : ''} to="/campana">Campaña</Link>
        <Link className={active('/dm') ? 'nav-active' : ''} to="/dm">Panel del DM</Link>
        <button onClick={logout} className="link-button">Salir ({user.displayName || user.email})</button>
      </nav>
    </header>
  );
}
