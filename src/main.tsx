import { createRoot } from 'react-dom/client'
import "./styles/Main.css"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { App } from './react/components/App.tsx';

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zu createRoot: https://react.dev/reference/react-dom/client/createRoot
// Quelle React Strict MOde: https://react.dev/reference/react/StrictMode


let root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
