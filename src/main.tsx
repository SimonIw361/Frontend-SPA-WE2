//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './App.css'
import Webseite from './Webseite.tsx'

import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
//import * as serviceworker from './serviceWorker'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { rootReducer } from './react/RootReducer.tsx'

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quellen zu configureStore: https://redux.js.org/introduction/why-rtk-is-redux-today
// Quelle zu createRoot: https://react.dev/reference/react-dom/client/createRoot
// Quelle zu Typen: https://react-redux.js.org/using-react-redux/usage-with-typescript

const store = configureStore({reducer: rootReducer});

let root = createRoot(document.getElementById('root')!)
root.render(
  <Provider store={store}>
    <Webseite /> 
  </Provider>,
)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
