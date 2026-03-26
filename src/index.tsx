import React from 'react';
import ReactDOM from 'react-dom/client';
import { NewTabPage } from './ui/pages/NewTabPage';
import './ui/styles/main.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NewTabPage />
  </React.StrictMode>
);
