import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { ContentProvider } from './context/ContentContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import './styles/styles.css';
import './styles/admin.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ContentProvider>
          <AdminAuthProvider>
            <App />
          </AdminAuthProvider>
        </ContentProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);