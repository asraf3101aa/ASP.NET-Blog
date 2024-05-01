import { useState } from "react";
import { FetchAPI } from "@/api/FetchAPI";
import { localStorageClient } from "@/contexts/StorageContext";
import { RepositoryContext } from "@/contexts/RepositoryContext";
import { ProviderProps, RepositoryProps } from "@/@types/providers";
import { AccountRepository } from "@/repositories/AccountRepository";

/**
 * RepositoryProvider: A component to provide Repository context to its children.
 *
 * Props:
 * - children: React node representing the children components.
 */
const RepositoryProvider = ({ children }: ProviderProps) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const fetchAPI = new FetchAPI(BASE_URL, localStorageClient);

  const accountRepository = new AccountRepository(fetchAPI);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create a shared context value
  const shared: RepositoryProps = {
    isLoading,
    setIsLoading,
    accountRepository,
  };

  // Provide the context value to its children
  return (
    <RepositoryContext.Provider value={shared}>
      {children}
    </RepositoryContext.Provider>
  );
};

export default RepositoryProvider;
