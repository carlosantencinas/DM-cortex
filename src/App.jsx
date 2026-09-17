import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login.jsx';
import DmDashboard from './components/DmDashboard.jsx';
import CharacterSheet from './components/CharacterSheet.jsx';
import CharacterManager from './components/CharacterManager.jsx';
import CampaignLobby from './components/CampaignLobby.jsx';
import NavBar from './components/NavBar.jsx';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading">Cargando DM Cortex…</p>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <NavBar />}
      <main className="app-main">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/" element={<PrivateRoute><CharacterManager /></PrivateRoute>} />
          <Route path="/personajes" element={<PrivateRoute><CharacterManager /></PrivateRoute>} />
          <Route path="/personaje/:characterId" element={<PrivateRoute><CharacterSheet /></PrivateRoute>} />
          <Route path="/personaje" element={<PrivateRoute><CharacterManager /></PrivateRoute>} />
          <Route path="/campana" element={<PrivateRoute><CampaignLobby /></PrivateRoute>} />
          <Route path="/dm" element={<PrivateRoute><DmDashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
