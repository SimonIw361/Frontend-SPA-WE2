import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import "./Main.css"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { store } from './react/RootStore.ts';
import { TopMenu } from './react/TopMenu.tsx';
import { LandingPage } from './react/login/routes/LandingRouter.tsx';

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quellen zu configureStore: https://redux.js.org/introduction/why-rtk-is-redux-today
// Quelle zu createRoot: https://react.dev/reference/react-dom/client/createRoot
// Quelle zu Typen: https://react-redux.js.org/using-react-redux/usage-with-typescript
// Quelle React Strict MOde: https://react.dev/reference/react/StrictMode

const storeMain = store;

let root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Provider store={storeMain}>
      <TopMenu />
      <LandingPage />
    </Provider>
  </React.StrictMode>,
);


