import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import "./Main.css"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { store } from './react/components/RootStore.ts';
import { TopMenu } from './react/components/TopMenu.tsx';
import { LandingPage } from './react/login/routes/LandingRouter.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ActivityBar } from './react/components/ActivityBar.tsx';
import { Impressum, Kontakt, PageNotFound, UeberUns, Unauthorized } from './react/components/Pages.tsx';
import { UserPage } from './react/user/components/UserPage.tsx';
import { NewUserPage } from './react/user/components/NewUserPage.tsx';
import { UserEditPage } from './react/user/components/UserEditPage.tsx';

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quellen zu configureStore: https://redux.js.org/introduction/why-rtk-is-redux-today
// Quelle zu createRoot: https://react.dev/reference/react-dom/client/createRoot
// Quelle zu Typen: https://react-redux.js.org/using-react-redux/usage-with-typescript
// Quelle React Strict MOde: https://react.dev/reference/react/StrictMode
// Quelle zu React Router: https://www.w3schools.com/react/react_router.asp

const storeMain = store;

let root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={storeMain}>
        <TopMenu />
        <div id="inhalt">
          <ActivityBar />
          <Routes>
            <Route path="/">
              <Route index element={<LandingPage />}></Route>
              <Route path="/ueberuns" element={<UeberUns />}></Route>
              <Route path="/kontakt" element={<Kontakt />}></Route>
              <Route path="/impressum" element={<Impressum />}></Route>
              <Route path="/users" >
                <Route index element={<UserPage />}></Route>
                <Route path="/users/newUser" element={<NewUserPage />}></Route>
                <Route path="/users/editUser" element={<UserEditPage />}></Route>
              </Route>
              <Route path="/unauthorized" element={<Unauthorized />}></Route>
              <Route path="*" element={<PageNotFound />}></Route>
            </Route>
          </Routes>
        </div>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);


