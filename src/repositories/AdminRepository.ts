import { IFetchAPI } from "@/api/IFetchAPI";
import { AccountModels } from "@/@types/account";
import { AdminDashboardData } from "@/@types/admin";
import { ApiEndpointPaths } from "@/@enums/api.enum";
import { IAdminRepository } from "@/@types/repository";
import { AdminEndpointPaths } from "@/@enums/admin.enum";
import { AccountModelsType } from "@/@enums/account.enum";

export class AdminRepository implements IAdminRepository {
  private _fetchAPI: IFetchAPI;
  private _adminEndpointPath = ApiEndpointPaths.ADMIN;

  constructor(fetchAPI: IFetchAPI) {
    this._fetchAPI = fetchAPI;
  }

  async register(adminData: AccountModels[AccountModelsType.ACCOUNT_REGISTER]) {
    return await this._fetchAPI.post<
      string,
      AccountModels[AccountModelsType.ACCOUNT_REGISTER]
    >(
      `${this._adminEndpointPath}/${AdminEndpointPaths.ADMIN_REGISTER}`,
      adminData
    );
  }

  async getDashboardData(duration: string, month: number) {
    return await this._fetchAPI.get<AdminDashboardData>(
      `${this._adminEndpointPath}/${AdminEndpointPaths.ADMIN_DASHBOARD}?duration=${duration}&month=${month}`
    );
  }
}
