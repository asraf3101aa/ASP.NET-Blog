import { AuthToken } from "@/@types/account";

/**
 * An interface defining methods for interacting with local storage.
 */
export interface ILocalStorage {
  /**
   * Retrieves the access token from local storage.
   *
   * @returns {string | null} The stored access token, or null if not found.
   */
  getAccessToken(): string | null;

  /**
   * Stores the access token in local storage.
   *
   * @param {AuthToken} authToken - The token to store.
   */
  setAccessToken(authToken: AuthToken): void;

  /**
   * Clears all data from local storage.
   */
  clearLocalStorage(): void;
}
