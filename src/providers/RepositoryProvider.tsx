import { FetchAPI } from "@/api/FetchAPI";
import { RepositoryContext } from "@/contexts/RepositoryContext";
import { AccountRepository } from "@/repositories/AccountRepository";
import { ProviderProps, RepositoryProps } from "@/@types/providers";
import { localStorageClient } from "@/contexts/StorageContext";

/**
 * RepositoryProvider: A component to provide Repository context to its children.
 *
 * Props:
 * - children: React node representing the children components.
 */
export const RepositoryProvider = ({ children }: ProviderProps) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const fetchAPI = new FetchAPI(BASE_URL, localStorageClient);

  const accountRepository = new AccountRepository(fetchAPI);

  // Create a shared context value
  const shared: RepositoryProps = { accountRepository };

  // Provide the context value to its children
  return (
    <RepositoryContext.Provider value={shared}>
      {children}
    </RepositoryContext.Provider>
  );
};
