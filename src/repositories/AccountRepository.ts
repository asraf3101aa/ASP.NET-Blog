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
    >(this._accountEndpointPath, userData, false);
  }

  async login(userData: AccountModels[AccountModelsType.USER_LOGIN]) {
    return await this._fetchAPI.post<
      AccountModels[AccountModelsType.AUTH_TOKEN],
      AccountModels[AccountModelsType.USER_LOGIN]
    >(
      `${this._accountEndpointPath}/${AccountEndpointPaths.USER_LOGIN}`,
      userData,
      false
    );
  }

  async confirmEmail(token: string, email: string) {
    return await this._fetchAPI.get<string>(
      `${this._accountEndpointPath}/${AccountEndpointPaths.ACCOUNT_CONFIRM}?token=${token}&email=${email}`
    );
  }

  async sendForgotPasswordRequest(email: string) {
    return await this._fetchAPI.post<
      string,
      AccountModels[AccountModelsType.EMAIL_MODEL]
    >(`${this._accountEndpointPath}/${AccountEndpointPaths.PASSWORD_FORGOT}`, {
      email,
    });
  }

  async confirmPassword(
    confirmPasswordData: AccountModels[AccountModelsType.CONFIRM_PASSWORD]
  ) {
    return await this._fetchAPI.post<
      string,
      AccountModels[AccountModelsType.CONFIRM_PASSWORD]
    >(
      `${this._accountEndpointPath}/${AccountEndpointPaths.PASSWORD_CONFIRM}`,
      confirmPasswordData
    );
  }

  async userUpdate(updatedData: AccountModels[AccountModelsType.USER_UPDATE]) {
    return await this._fetchAPI.update<
      string,
      AccountModels[AccountModelsType.USER_UPDATE]
    >(this._accountEndpointPath, updatedData);
  }

  async deleteAccount() {
    return await this._fetchAPI.delete<string>(this._accountEndpointPath);
  }

  async getProfile() {
    return await this._fetchAPI.get<AccountModels[AccountModelsType.USER]>(
      this._accountEndpointPath
    );
  }

  async resendEmailConfirmation() {
    return await this._fetchAPI.post<string, undefined>(
      `${this._accountEndpointPath}/${AccountEndpointPaths.EMAIL_CONFIRM}`,
      undefined
    );
  }

  async updateEmail(email: string) {
    return await this._fetchAPI.update<
      string,
      AccountModels[AccountModelsType.EMAIL_MODEL]
    >(`${this._accountEndpointPath}/${AccountEndpointPaths.EMAIL_UPDATE}`, {
      email,
    });
  }

  async changePassword(
    passwordUpdateData: AccountModels[AccountModelsType.CHANGE_PASSWORD]
  ) {
    return await this._fetchAPI.update<
      string,
      AccountModels[AccountModelsType.CHANGE_PASSWORD]
    >(
      `${this._accountEndpointPath}/${AccountEndpointPaths.CHANGE_PASSWORD}`,
      passwordUpdateData
    );
  }
}
