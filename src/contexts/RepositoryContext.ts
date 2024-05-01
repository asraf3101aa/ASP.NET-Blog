import { FetchAPI } from "@/api/FetchAPI";
import { createContext, useContext } from "react";
import { RepositoryProps } from "@/@types/providers";
import { localStorageClient } from "./StorageContext";
import { AccountRepository } from "@/repositories/AccountRepository";

/**
 * RepositoryContext: A context for managing Repository-related functions.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const fetchAPI = new FetchAPI(BASE_URL, localStorageClient);
export const accountRepository = new AccountRepository(fetchAPI);

export const RepositoryContext = createContext<RepositoryProps | null>(null);

/**
 * useRepository: A custom hook to access the Repository context.
 *
 * Returns:
 * - An object containing functions to handle return navigation and redirection.
 */
export const useRepository = () => useContext(RepositoryContext);
