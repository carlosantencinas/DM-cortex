import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/personaje" className="navbar-brand">🎲 Mesa de Juego</Link>
      {user && (
        <nav className="navbar-links">
          <Link to="/personaje">Mi hoja</Link>
          <Link to="/dm">Panel del DM</Link>
          <button onClick={logout} className="link-button">Salir ({user.displayName})</button>
        </nav>
      )}
    </header>
  );
}
