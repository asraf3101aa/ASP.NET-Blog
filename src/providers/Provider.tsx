import TitleProvider from "./TitleProvider";
import RouterProvider from "./RouterProvider";
import StorageProvider from "./StorageProvider";
import { ProviderProps } from "@/@types/providers";
import RepositoryProvider from "./RepositoryProvider";

/**
 * Provider: A component that serves as a provider for its children components.
 *
 * Props:
 * - children: A React node representing the children components.
 *
 * Providers Used:
 * - RouterProvider: Provides routing capabilities to its children components.
 */
const Provider = ({ children }: ProviderProps) => {
  return (
    <TitleProvider>
      <RepositoryProvider>
        <StorageProvider>
          <RouterProvider>{children}</RouterProvider>
        </StorageProvider>
      </RepositoryProvider>
    </TitleProvider>
  );
};

export default Provider;
