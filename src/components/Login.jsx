import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login(){
  const {user,login}=useAuth();
  if(user)return <Navigate to="/personaje" replace/>;
  return <div className="login-screen"><div className="login-glow"/><div className="login-card"><div className="brand-mark">◆</div><div className="eyebrow">D&D 5.5e · Mesa digital</div><h1>DM CORTEX</h1><p>Tu hoja de personaje, tu campaña y tu mesa de juego en un solo lugar.</p><button onClick={login} className="btn-primary login-button"><span>G</span> Continuar con Google</button><small>Sin contraseñas adicionales. Tu progreso se sincroniza con la campaña.</small></div></div>;
}
