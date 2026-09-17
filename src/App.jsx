import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login.jsx';
import DmDashboard from './components/DmDashboard.jsx';
import CharacterSheet from './components/CharacterSheet.jsx';
import NavBar from './components/NavBar.jsx';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading">Cargando…</p>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/personaje"
            element={
              <PrivateRoute>
                <CharacterSheet />
              </PrivateRoute>
            }
          />
          <Route
            path="/dm"
            element={
              <PrivateRoute>
                <DmDashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/personaje" replace />} />
        </Routes>
      </main>
    </>
  );
}
