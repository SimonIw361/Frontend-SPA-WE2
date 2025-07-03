import { Route, Routes } from "react-router-dom";
import { LandingPage } from "./LandingRouter";
import { Impressum, Kontakt, PageNotFound, UeberUns, Unauthorized } from "../components/Pages";
import { UserPage } from "../user/UserPage";
import { NewUserPage } from "../user/components/NewUserPage";
import { UserEditPage } from "../user/components/UserEditPage";
import { DegreeCoursePage } from "../degreeCourse/DegreeCoursePage";
import { NewDegreeCoursePage } from "../degreeCourse/components/NewDegreeCoursePage";
import { DegreeCourseEditPage } from "../degreeCourse/components/DegreeCourseEditPage";
import { NewDegreeCourseApplicationPage } from "../degreeCourseApplication/components/NewDegreeCourseApplicationPage";
import { DegreeCourseApplicationPage } from "../degreeCourseApplication/DegreeCourseApplicationPage";
import { DegreeCourseApplicationEditPage } from "../degreeCourseApplication/components/DegreeCourseApplicationEditPage";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zu React Router: https://www.w3schools.com/react/react_router.asp

export function AppRoutes() {
  return <Routes>

    <Route path="/">
      <Route index element={<LandingPage />}></Route>
      <Route path="/ueberuns" element={<UeberUns />}></Route>
      <Route path="/kontakt" element={<Kontakt />}></Route>
      <Route path="/impressum" element={<Impressum />}></Route>

      <Route path="/user" >
        <Route index element={<UserPage />}></Route>
        <Route path="/user/newUser" element={<NewUserPage />}></Route>
        <Route path="/user/editUser" element={<UserEditPage />}></Route>
      </Route>
      <Route path="/degreeCourse" >
        <Route index element={<DegreeCoursePage />}></Route>
        <Route path="/degreeCourse/newDegreeCourse" element={<NewDegreeCoursePage />}></Route>
        <Route path="/degreeCourse/editDegreeCourse" element={<DegreeCourseEditPage />}></Route>
      </Route>
      <Route path="/degreeCourseApplication" >
        <Route index element={<DegreeCourseApplicationPage />}></Route>
        <Route path="/degreeCourseApplication/newDegreeCourseApplication" element={<NewDegreeCourseApplicationPage/>}></Route>
        <Route path="/degreeCourseApplication/editDegreeCourseApplication" element={<DegreeCourseApplicationEditPage />}></Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />}></Route>
      <Route path="*" element={<PageNotFound />}></Route>
    </Route>
    
  </Routes>;
}