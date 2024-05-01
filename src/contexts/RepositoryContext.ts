import { RepositoryProps } from "@/@types/providers";
import { createContext, useContext } from "react";

/**
 * RepositoryContext: A context for managing Repository-related functions.
 */

export const RepositoryContext = createContext<RepositoryProps | null>(null);

/**
 * useRepository: A custom hook to access the Repository context.
 *
 * Returns:
 * - An object containing functions to handle return navigation and redirection.
 */
export const useRepository = () => useContext(RepositoryContext);
