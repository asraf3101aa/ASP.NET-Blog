import { AccountModels } from "@/@types/account";
import { AccountModelsType } from "@/@enums/account.enum";

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
   * @param {AccountModels[AccountModelsType.AUTH_TOKEN]} authToken - The token to store.
   */
  setAccessToken(authToken: AccountModels[AccountModelsType.AUTH_TOKEN]): void;

  /**
   * Clears all data from local storage.
   */
  clearLocalStorage(): void;
}
