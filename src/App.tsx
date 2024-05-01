import Router from "@/routes/Router";
import Provider from "@/providers/Provider";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Provider>
        <Router />
      </Provider>
    </BrowserRouter>
  );
};

export default App;
