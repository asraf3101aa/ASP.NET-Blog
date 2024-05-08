import Blog from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ProtectedRoutes from "./ProtectedRoutes";
import { RoutePath } from "@/@enums/router.enum";
import { Route, Routes } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import BlogDetails from "@/pages/BlogDetails";
import ConfirmEmail from "@/components/shared/profile/ConfirmEmail";
import ResetPassword from "@/components/shared/profile/ResetPassword";

const Router = () => {
  return (
    <Routes>
      <Route path={RoutePath.HOME} element={<Blog />} />
      <Route path={RoutePath.LOGIN} element={<SignIn />} />
      <Route path={RoutePath.SIGN_UP} element={<SignUp />} />
      <Route path={`${RoutePath.DETAILS}/:id`} element={<BlogDetails />} />
      <Route path={RoutePath.CONFIRM_EMAIL} element={<ConfirmEmail />} />
      <Route path={RoutePath.RESET_PASSWORD} element={<ResetPassword />} />
      <Route element={<ProtectedRoutes />}>
        <Route path={RoutePath.PROFILE} element={<Profile />} />
        <Route path={RoutePath.DASHBOARD} element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default Router;
