import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ProtectedRoutes from "./ProtectedRoutes";
import { RoutePath } from "@/@enums/router.enum";
import { Route, Routes } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import BlogDetails from "@/pages/BlogDetails";
import ConfirmEmail from "@/components/shared/profile/ConfirmEmail";

const Router = () => {
  return (
    <Routes>
      <Route path={RoutePath.LOGIN} element={<SignIn />} />
      <Route path={RoutePath.SIGN_UP} element={<SignUp />} />
      <Route path={RoutePath.HOME} element={<Home />} />
      <Route path={RoutePath.CONFIRM_EMAIL} element={<ConfirmEmail />} />
      <Route element={<ProtectedRoutes />}>
        <Route path={RoutePath.DASHBOARD} element={<Dashboard />} />
        <Route path={RoutePath.PROFILE} element={<Profile />} />
        <Route path={RoutePath.DETAILS} element={<BlogDetails />} />
      </Route>
    </Routes>
  );
};

export default Router;
