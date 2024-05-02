import { useState } from "react";
import {
  blogRepository,
  adminRepository,
  accountRepository,
  RepositoryContext,
} from "@/contexts/RepositoryContext";
import { ProviderProps, RepositoryProps } from "@/@types/providers";

/**
 * RepositoryProvider: A component to provide Repository context to its children.
 *
 * Props:
 * - children: React node representing the children components.
 */
const RepositoryProvider = ({ children }: ProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create a shared context value
  const shared: RepositoryProps = {
    isLoading,
    setIsLoading,
    blogRepository,
    adminRepository,
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
