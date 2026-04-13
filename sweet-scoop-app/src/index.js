import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './Style.css'
import AuthProvider from './components/AuthContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
 <React.StrictMode>
    <App />
  </React.StrictMode>
  </>
);


