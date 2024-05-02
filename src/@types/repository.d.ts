import { AccountModels } from "./account";
import { AccountModelsType } from "@/@enums/account.enum";
import { AdminDashboardData } from "./admin";

/**
 * Interface for managing user account-related operations.
 */
export interface IAccountRepository {
  /**
   * Registers a new user.
   * @param userData - The data required to register a new user.
   * @returns A promise that resolves with an API response containing a success message.
   */
  register: (
    userData: AccountModels[AccountModelsType.USER_REGISTER]
  ) => Promise<ApiResponse<string>>;

  /**
   * Logs in an existing user.
   * @param userData - The data required to log in a user.
   * @returns A promise that resolves with an API response containing the user's authentication token.
   */
  login: (
    userData: AccountModels[AccountModelsType.USER_LOGIN]
  ) => Promise<ApiResponse<AccountModels[AccountModelsType.AUTH_TOKEN]>>;

  /**
   * Confirms a user's email address.
   * @param token - The token provided for email confirmation.
   * @param email - The email address to confirm.
   * @returns A promise that resolves with an API response containing a success message.
   */
  confirmEmail: (token: string, email: string) => Promise<ApiResponse<string>>;

  /**
   * Sends a forgot password request.
   * @param email - The email address to send the password reset link to.
   * @returns A promise that resolves with an API response containing a success message.
   */
  sendForgotPasswordRequest: (email: string) => Promise<ApiResponse<string>>;

  /**
   * Resets the user's password.
   * @param resetPasswordData - The data required to reset the password.
   * @returns A promise that resolves with an API response containing a success message.
   */
  resetPassword: (
    resetPasswordData: AccountModels[AccountModelsType.RESET_PASSWORD]
  ) => Promise<ApiResponse<string>>;

  /**
   * Updates the user's account information.
   * @param updatedData - The new data to update the user's account with.
   * @returns A promise that resolves with an API response containing a success message.
   */
  userUpdate: (
    updatedData: AccountModels[AccountModelsType.USER_UPDATE]
  ) => Promise<ApiResponse<string>>;

  /**
   * Deletes the user's account.
   * @returns A promise that resolves with an API response containing a success message.
   */
  deleteAccount: () => Promise<ApiResponse<string>>;

  /**
   * Retrieves the user's profile information.
   * @param pageNumber - The page number for pagination.
   * @returns A promise that resolves with an API response containing the user's profile information.
   */
  getProfile: (
    pageNumber: number
  ) => Promise<ApiResponse<AccountModels[AccountModelsType.USER]>>;

  /**
   * Resends the email confirmation link.
   * @returns A promise that resolves with an API response containing a success message.
   */
  resendEmailConfirmation: () => Promise<ApiResponse<string>>;

  /**
   * Updates the user's email address.
   * @param email - The new email address to update.
   * @returns A promise that resolves with an API response containing a success message.
   */
  updateEmail: (email: string) => Promise<ApiResponse<string>>;

  /**
   * Changes the user's password.
   * @param passwordUpdateData - The data required to change the password.
   * @returns A promise that resolves with an API response containing a success message.
   */
  changePassword: (
    passwordUpdateData: AccountModels[AccountModelsType.CHANGE_PASSWORD]
  ) => Promise<ApiResponse<string>>;
}

/**
 * Interface for managing admin-related operations.
 */
export interface IAdminRepository {
  /**
   * Registers a new admin.
   * @param adminData - The data required to register a new admin.
   * @returns A promise that resolves with an API response containing a success message.
   */
  register: (
    adminData: AccountModels[AccountModelsType.ACCOUNT_REGISTER]
  ) => Promise<ApiResponse<string>>;

  /**
   * Fetches the admin dashboard data.
   * @param duration - The duration for the dashboard data (e.g., 'weekly', 'monthly').
   * @param month - The specific month for which to fetch data.
   * @returns A promise that resolves with an API response containing the admin dashboard data.
   */
  getDashboardData: (
    duration: string,
    month: number
  ) => Promise<ApiResponse<AdminDashboardData>>;
}
