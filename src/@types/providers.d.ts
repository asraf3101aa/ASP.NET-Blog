/**
 * ProviderProps: Represents props for a provider component.
 *
 * Props:
 * - children: A React node representing the children components.
 */
declare type ProviderProps = {
  children: React.ReactNode;
};

/**
 * RouterProps: Represents the props of the router context.
 *
 * Properties:
 * - handleReturn: A function to handle navigation back.
 * - handleRedirect: A function to handle navigation redirection.
 */
declare type RouterProps = {
  handleReturn: () => void;
  handleRedirect: (route: string) => void;
};
