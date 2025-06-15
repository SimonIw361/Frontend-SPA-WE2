import { Route, Routes } from "react-router-dom";



export function AppRoutes() {
    return <Routes>
        <Route path="/" element={<div>home</div>}></Route>
        <Route path="/ueberuns" element={<div>Ueber uns</div>}></Route>
    </Routes>
}