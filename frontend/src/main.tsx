import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApplicationShell } from './App';
import './index.css';

const mountPoint = document.getElementById('app-root');

if (!mountPoint) {
  throw new Error('Could not find app-root element to mount React application');
}

ReactDOM.createRoot(mountPoint).render(
  <React.StrictMode>
    <ApplicationShell />
  </React.StrictMode>
);
