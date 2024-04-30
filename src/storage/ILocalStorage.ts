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
   * Retrieves the refresh token from local storage.
   *
   * @returns {string | null} The stored refresh token, or null if not found.
   */
  getRefreshToken(): string | null;

  /**
   * Stores the access and refresh tokens in local storage.
   *
   * @param {AuthTokens} authTokens - The tokens to store.
   */
  setAuthTokens(authTokens: AuthTokens): void;

  /**
   * Clears all data from local storage.
   */
  clearLocalStorage(): void;
}
