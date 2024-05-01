import { IFetchAPI } from "@/api/IFetchAPI";
import { AccountModels } from "@/@types/account";
import { ApiEndpointPaths } from "@/@enums/api.enum";
import { IAccountRepository } from "@/@types/repository";
import { AccountEndpointPaths, AccountModelsType } from "@/@enums/account.enum";

export class AccountRepository implements IAccountRepository {
  private _fetchAPI: IFetchAPI;
  private _accountEndpointPath = ApiEndpointPaths.ACCOUNT;
  constructor(fetchAPI: IFetchAPI) {
    this._fetchAPI = fetchAPI;
  }

  async register(userData: AccountModels[AccountModelsType.USER_REGISTER]) {
    return await this._fetchAPI.post<
      string,
      AccountModels[AccountModelsType.USER_REGISTER]
    >(
      `${this._accountEndpointPath}/${AccountEndpointPaths.USER_REGISTER}`,
      userData
    );
  }

  async login(userData: AccountModels[AccountModelsType.USER_LOGIN]) {
    return await this._fetchAPI.post<
      AccountModels[AccountModelsType.AUTH_TOKEN],
      AccountModels[AccountModelsType.USER_LOGIN]
    >(
      `${this._accountEndpointPath}/${AccountEndpointPaths.USER_LOGIN}`,
      userData
    );
  }
}
