import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RoutePath, RouteTitle } from "@/@enums/router.enum";

// TitleProvider component to update browser tab title based on current route
const TitleProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    // Set the title based on the current path
    switch (location.pathname) {
      case RoutePath.HOME:
        document.title = `${RouteTitle.HOME} | Blog`;
        break;
      case RoutePath.LOGIN:
        document.title = `${RouteTitle.LOGIN} | Blog`;
        break;
      case RoutePath.SIGN_UP:
        document.title = `${RouteTitle.SIGN_UP} | Blog`;
        break;
      default:
        document.title = "Blog App";
    }
  }, [location.pathname]); // Run this effect when the path changes

  return <>{children}</>; // Render children as usual
};

export default TitleProvider;
