import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {App} from './App.tsx'
import { Login, LoginWeg } from './react/login/components/LoginComponent.tsx'
// import ReactDOM from 'react-dom'
// import Provider from 'react-redux'

LoginWeg();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Login />
    <App />
  </StrictMode>,
)

// ReactDOM.render(
//   <Provider store={store}><App /></Provider>,
//   document.getElementById("root")
// )
