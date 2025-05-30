//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './App.css'
import Webseite from './Webseite.tsx'

import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
//import * as serviceworker from './serviceWorker'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { rootReducer } from './react/RootReducer.tsx'

//Quellen: https://redux.js.org/introduction/why-rtk-is-redux-today


let store = configureStore({reducer: rootReducer});

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Webseite user={undefined} authenticationReducer={undefined}/> 
  </Provider>,
)
//das mit undefined ist komisch, verbessern!