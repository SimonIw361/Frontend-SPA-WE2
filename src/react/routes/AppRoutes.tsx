import { Route, Routes } from "react-router-dom";
import { LandingPage } from "./LandingRouter";
import { Impressum, Kontakt, PageNotFound, UeberUns, Unauthorized } from "../components/Pages";
import { UserPage } from "../user/components/UserPage";
import { NewUserPage } from "../user/components/NewUserPage";
import { UserEditPage } from "../user/components/UserEditPage";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zu React Router: https://www.w3schools.com/react/react_router.asp

export function AppRoutes() {
  return <Routes>
    <Route path="/">
      <Route index element={<LandingPage />}></Route>
      {/* <Route path="/profil" element={<ProfilPage />}></Route> */}
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
}