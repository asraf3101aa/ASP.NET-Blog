import Home from "@/pages/Home";
import { Provider } from "@/providers/Provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "@/pages/SignUp";
import SignIn from "@/pages/SignIn";
import { RoutePath } from "./@enums/router.enum";

const App = () => {
  return (
    <BrowserRouter>
      <Provider>
        <Routes>
          <Route path={RoutePath.HOME} element={<Home />} />
          <Route path={RoutePath.LOGIN} element={<SignIn />} />
          <Route path={RoutePath.SIGN_UP} element={<SignUp />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
};
export default App;
