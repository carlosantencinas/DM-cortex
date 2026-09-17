import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/global.css';
import './styles/campaign-builder.css';

// GitHub Pages has no server-side fallback for React Router. public/404.html
// stores a direct route here before returning to the app entry point.
const spaPath = sessionStorage.getItem('dm-cortex-spa-path');
if (spaPath) {
  sessionStorage.removeItem('dm-cortex-spa-path');
  window.history.replaceState(null, '', `${import.meta.env.BASE_URL}${spaPath}`);
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
