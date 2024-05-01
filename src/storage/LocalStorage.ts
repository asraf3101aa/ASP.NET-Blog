import { AuthToken } from "@/@types/account";
import { ILocalStorage } from "./ILocalStorage";
import { LocalStorageItemsKeys } from "@/@enums/storage.enum";

export class LocalStorage implements ILocalStorage {
  private _localStorageClient: Storage;
  constructor(localStorageClient: Storage) {
    this._localStorageClient = localStorageClient;
  }
  getAccessToken() {
    return this._localStorageClient.getItem(LocalStorageItemsKeys.ACCESS_TOKEN);
  }
  setAccessToken(authToken: AuthToken) {
    this._localStorageClient.setItem(
      LocalStorageItemsKeys.ACCESS_TOKEN,
      authToken.accessToken
    );
  }
  clearLocalStorage() {
    this._localStorageClient.clear();
  }
}
