import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();

  if (user) return <Navigate to="/personaje" replace />;

  return (
    <div className="login-screen">
      <h1>Hojas de Personaje D&D 5.5e</h1>
      <p>Iniciá sesión para crear tu personaje o unirte a la campaña de tu DM.</p>
      <button onClick={login} className="btn-primary">Ingresar con Google</button>
    </div>
  );
}
