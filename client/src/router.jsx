import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register } from "./pages/register.page.jsx";
 import './App.css'
 import { Login } from "./pages/login.page.jsx";
import { ForgotPassword } from "./pages/forgotpassword.page.jsx";
import { ResetPassword } from "./pages/resetpassword.page.jsx";
//import { Logout } from "./pages/logout.page.jsx";
import HomePage from "../src/home/dashboard.jsx"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
         <Route path="/login" element={<Login />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/*<Route path="/logout" element={<Logout />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
