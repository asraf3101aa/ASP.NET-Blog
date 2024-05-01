import { ProviderProps } from "@/@types/providers";
import { StorageContext, localStorageClient } from "@/contexts/StorageContext";

/**
 * StorageProvider: A component to provide Storage context to its children.
 *
 * Props:
 * - children: React node representing the children components.
 */
export const StorageProvider = ({ children }: ProviderProps) => {
  // Provide the context value to its children
  return (
    <StorageContext.Provider value={localStorageClient}>
      {children}
    </StorageContext.Provider>
  );
};
