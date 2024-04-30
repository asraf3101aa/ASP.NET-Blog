import { useNavigate } from "react-router-dom";
import { RouterContext } from "@/contexts/RouterContext";

/**
 * RouterProvider: A component to provide router context to its children.
 *
 * Props:
 * - children: React node representing the children components.
 */
export const RouterProvider = ({ children }: ProviderProps) => {
  // Access `navigate` instance from Next.js useRouter hook
  const navigate = useNavigate();

  // Set up functions to handle return navigation
  const handleReturn = () => navigate(-1);
  // Reload the current page
  const handleRedirect = (route: string) => navigate(route);

  // Create a shared context value
  const shared: RouterProps = {
    handleReturn,
    handleRedirect,
  };

  // Provide the context value to its children
  return (
    <RouterContext.Provider value={shared}>{children}</RouterContext.Provider>
  );
};
