import _ from "lodash";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RoutePath, RouteTitle } from "@/@enums/router.enum";

// TitleProvider component to update browser tab title based on current route
const TitleProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    const appTitle: string | undefined = import.meta.env
      .VITE_BLOG_APP_HEADER_TITLE;

    let pageTitle: string | undefined = undefined;

    // Set the title based on the current path
    switch (location.pathname) {
      case RoutePath.HOME:
        pageTitle = RouteTitle.HOME;
        break;
      case RoutePath.LOGIN:
        pageTitle = RouteTitle.LOGIN;
        break;
      case RoutePath.SIGN_UP:
        pageTitle = RouteTitle.SIGN_UP;
        break;
      case RoutePath.DASHBOARD:
        pageTitle = RouteTitle.DASHBOARD;
        break;
      case RoutePath.PROFILE:
        pageTitle = RouteTitle.PROFILE;
        break;
      case RoutePath.CONFIRM_EMAIL:
        pageTitle = RouteTitle.CONFIRM_EMAIL;
        break;
      default:
        pageTitle = appTitle ?? "Blog";
    }

    if (_.includes(location.pathname, RoutePath.DETAILS)) {
      pageTitle = RouteTitle.DETAILS;
    }

    const doesPageTitleBelongToRouteTitle = _.find(
      RouteTitle,
      (routeTitle: string) => routeTitle === pageTitle
    );
    document.title = doesPageTitleBelongToRouteTitle
      ? appTitle
        ? `${pageTitle} | ${appTitle}`
        : pageTitle // Route title
      : pageTitle; // App title or `Blog`
  }, [location.pathname]);

  return <>{children}</>; // Render children as usual
};

export default TitleProvider;
