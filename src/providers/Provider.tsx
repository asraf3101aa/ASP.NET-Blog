import { ProviderProps } from "@/@types/providers";
import { RouterProvider } from "./RouterProvider";
import TitleProvider from "./TitleProvider";
import { RepositoryProvider } from "./RepositoryProvider";

/**
 * Provider: A component that serves as a provider for its children components.
 *
 * Props:
 * - children: A React node representing the children components.
 *
 * Providers Used:
 * - RouterProvider: Provides routing capabilities to its children components.
 */
export const Provider = ({ children }: ProviderProps) => {
  return (
    <TitleProvider>
      <RepositoryProvider>
        <RouterProvider>{children}</RouterProvider>
      </RepositoryProvider>
    </TitleProvider>
  );
};
