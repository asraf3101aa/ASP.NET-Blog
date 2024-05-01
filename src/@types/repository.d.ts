import { AccountModelsType } from "@/@enums/account.enum";
import { AccountModels } from "./account";

declare type IAccountRepository = {
  register: (
    userData: AccountModels[AccountModelsType.USER_REGISTER]
  ) => Promise<ApiResponse<string>>;
  login: (
    userData: AccountModels[AccountModelsType.USER_LOGIN]
  ) => Promise<ApiResponse<AccountModels[AccountModelsType.AUTH_TOKEN]>>;
};
