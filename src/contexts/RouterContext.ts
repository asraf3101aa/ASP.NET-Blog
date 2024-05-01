import { RouterProps } from "@/@types/providers";
import { createContext, useContext } from "react";

/**
 * RouterContext: A context for managing router-related functions.
 */
export const RouterContext = createContext<RouterProps | null>(null);

/**
 * useRouter: A custom hook to access the router context.
 *
 * Returns:
 * - An object containing functions to handle return navigation and redirection.
 */
export const useRouter = () => useContext(RouterContext);
