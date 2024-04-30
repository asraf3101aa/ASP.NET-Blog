import { ILocalStorage } from "./ILocalStorage";

export class LocalStorage implements ILocalStorage {
  private _localStorageClient: Storage;
  constructor(localStorageClient: Storage) {
    this._localStorageClient = localStorageClient;
  }
  getAccessToken() {
    return this._localStorageClient.getItem(LocalStorageItemsKeys.ACCESS_TOKEN);
  }
  getRefreshToken() {
    return this._localStorageClient.getItem(
      LocalStorageItemsKeys.REFRESH_TOKEN
    );
  }
  setAuthTokens(authTokens: AuthTokens) {
    this._localStorageClient.setItem(
      LocalStorageItemsKeys.ACCESS_TOKEN,
      authTokens.access_token
    );
    this._localStorageClient.setItem(
      LocalStorageItemsKeys.REFRESH_TOKEN,
      authTokens.refrest_token
    );
  }
  clearLocalStorage() {
    this._localStorageClient.clear();
  }
}
