import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ProtectedRoutes from "./ProtectedRoutes";
import { RoutePath } from "@/@enums/router.enum";
import { Route, Routes } from "react-router-dom";

const Router = () => {
  return (
    <Routes>
      <Route path={RoutePath.LOGIN} element={<SignIn />} />
      <Route path={RoutePath.SIGN_UP} element={<SignUp />} />
      <Route element={<ProtectedRoutes />}>
        <Route path={RoutePath.HOME} element={<Home />} />
      </Route>
    </Routes>
  );
};

export default Router;
