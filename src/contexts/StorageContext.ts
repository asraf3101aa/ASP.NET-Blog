import { LocalStorage } from "@/storage/LocalStorage";
import { createContext, useContext } from "react";

/**
 * StorageContext: A context for managing router-related functions.
 */
export const localStorageClient = new LocalStorage(localStorage);
export const StorageContext = createContext<LocalStorage | null>(null);

/**
 * useStorage: A custom hook to access the router context.
 *
 * Returns:
 * - An object containing functions to handle return navigation and redirection.
 */
export const useStorage = () => useContext(StorageContext);
