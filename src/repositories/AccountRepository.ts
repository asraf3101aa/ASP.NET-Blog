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

  async confirmEmail(token: string, email: string) {
    return await this._fetchAPI.post<string, null>(
      `${this._accountEndpointPath}/${AccountEndpointPaths.EMAIL_CONFIRM}?token=${token}&email=${email}`,
      null
    );
  }

  async sendForgotPasswordRequest(email: string) {
    return await this._fetchAPI.post<
      string,
      AccountModels[AccountModelsType.EMAIL_MODEL]
    >(`${this._accountEndpointPath}/${AccountEndpointPaths.FORGOT_PASSWORD}`, {
      email,
    });
  }

  async resetPassword(
    resetPasswordData: AccountModels[AccountModelsType.RESET_PASSWORD]
  ) {
    return await this._fetchAPI.post<
      string,
      AccountModels[AccountModelsType.RESET_PASSWORD]
    >(
      `${this._accountEndpointPath}/${AccountEndpointPaths.FORGOT_PASSWORD}`,
      resetPasswordData
    );
  }

  async userUpdate(updatedData: AccountModels[AccountModelsType.USER_UPDATE]) {
    return await this._fetchAPI.update<
      string,
      AccountModels[AccountModelsType.USER_UPDATE]
    >(
      `${this._accountEndpointPath}/${AccountEndpointPaths.UPDATE}`,
      updatedData
    );
  }

  async deleteAccount() {
    return await this._fetchAPI.delete<string>(
      `${this._accountEndpointPath}/${AccountEndpointPaths.DELETE}`
    );
  }

  async getProfile(pageNumber: number) {
    return await this._fetchAPI.get<AccountModels[AccountModelsType.USER]>(
      `${this._accountEndpointPath}/${AccountEndpointPaths.PROFILE}?pageNumber=${pageNumber}`
    );
  }

  async resendEmailConfirmation() {
    return await this._fetchAPI.post<string, undefined>(
      `${this._accountEndpointPath}/${AccountEndpointPaths.EMAIL_CONFIRMATION_RESEND}`,
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
      `${this._accountEndpointPath}/${AccountEndpointPaths.PASSWORD_UPDATE}`,
      passwordUpdateData
    );
  }
}
