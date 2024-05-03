import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ProtectedRoutes from "./ProtectedRoutes";
import { RoutePath } from "@/@enums/router.enum";
import { Route, Routes } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";

const Router = () => {
  return (
    <Routes>
      <Route path={RoutePath.LOGIN} element={<SignIn />} />
      <Route path={RoutePath.SIGN_UP} element={<SignUp />} />
      <Route path={RoutePath.HOME} element={<Home />} />
      <Route element={<ProtectedRoutes />}>
        <Route path={RoutePath.DASHBOARD} element={<Dashboard />} />
        <Route path={RoutePath.PROFILE} element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default Router;
