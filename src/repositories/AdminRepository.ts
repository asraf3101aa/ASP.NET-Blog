import { IFetchAPI } from "@/api/IFetchAPI";
import { AccountModels } from "@/@types/account";
import { AdminDashboardData } from "@/@types/admin";
import { ApiEndpointPaths } from "@/@enums/api.enum";
import { IAdminRepository } from "@/@types/repository";
import { AccountModelsType } from "@/@enums/account.enum";
import { BlogsDurationFilters } from "@/@enums/blog.enum";

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
    >(this._adminEndpointPath, adminData);
  }

  async getDashboardData(duration: BlogsDurationFilters, month?: number) {
    const isDurationMonthly = duration === BlogsDurationFilters.MONTHLY;
    let apiEndpoint = `${this._adminEndpointPath}/dashboard`;
    if (isDurationMonthly) {
      apiEndpoint = `${apiEndpoint}?duration=${duration}&month=${month}`;
    }
    return await this._fetchAPI.get<AdminDashboardData>(apiEndpoint);
  }
}
