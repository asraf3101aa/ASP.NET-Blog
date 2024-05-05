import { useNavigate } from "react-router-dom";
import { RouterContext } from "@/contexts/RouterContext";
import { ProviderProps, RouterProps } from "@/@types/providers";

/**
 * RouterProvider: A component to provide router context to its children.
 *
 * Props:
 * - children: React node representing the children components.
 */
const RouterProvider = ({ children }: ProviderProps) => {
  // Access `navigate` instance from React's useNavigate hook
  const navigate = useNavigate();

  // Handle return navigation, 0 means go to current page in Browser history
  const handleReload = () => navigate(0);
  // Redirect from the current page to a provided route
  const handleRedirect = (route: string) => navigate(route);

  // Create a shared context value
  const shared: RouterProps = {
    handleReload,
    handleRedirect,
  };

  // Provide the context value to its children
  return (
    <RouterContext.Provider value={shared}>{children}</RouterContext.Provider>
  );
};

export default RouterProvider;
