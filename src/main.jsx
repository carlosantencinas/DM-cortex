import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/global.css';
import './styles/campaign-builder.css';
import './styles/character-ui.css';

const spaPath = sessionStorage.getItem('dm-cortex-spa-path');
if (spaPath) {
  sessionStorage.removeItem('dm-cortex-spa-path');
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const cleanPath = spaPath.startsWith('/') ? spaPath : `/${spaPath}`;
  window.history.replaceState(null, '', `${base}${cleanPath}`);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
