import { AccountModels } from "./account";
import { BlogModels } from "@/@types/blog";
import { AdminDashboardData } from "./admin";
import { AccountModelsType } from "@/@enums/account.enum";
import { BlogModelsType, ReactionType } from "@/@enums/blog.enum";

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

/**
 * Interface for a blog repository, outlining the contract for interacting with blog-related data.
 */
export interface IBlogRepository {
  /**
   * Retrieves a list of blogs with sorting and pagination.
   * @param sortBy - The field to sort by.
   * @param pageNumber - The page number for pagination.
   * @returns A promise resolving to a list of blogs wrapped in an ApiResponse.
   */
  getBlogs(
    sortBy: string,
    pageNumber: number
  ): Promise<ApiResponse<BlogModels[BlogModelsType.BLOGS_LIST]>>;

  /**
   * Creates a new blog entry.
   * @param blogData - The partial data for creating a new blog.
   * @returns A promise resolving to the created blog wrapped in an ApiResponse.
   */
  createBlog(
    blogData: BlogModels[BlogModelsType.BLOG_PARTIAL_DATA]
  ): Promise<ApiResponse<BlogModels[BlogModelsType.BLOG]>>;

  /**
   * Gets the details of a specific blog by ID.
   * @param id - The ID of the blog.
   * @returns A promise resolving to the blog details wrapped in an ApiResponse.
   */
  getBlogDetails(
    id: string
  ): Promise<ApiResponse<BlogModels[BlogModelsType.BLOG]>>;

  /**
   * Retrieves all blog categories.
   * @returns A promise resolving to a list of categories wrapped in an ApiResponse.
   */
  getCategories(): Promise<ApiResponse<BlogModels[BlogModelsType.CATEGORY][]>>;

  /**
   * Updates a specific blog by ID with new data.
   * @param id - The ID of the blog to update.
   * @param updatedData - The updated blog data.
   * @returns A promise resolving to a confirmation message or updated blog wrapped in an ApiResponse.
   */
  updateBlog(
    id: string,
    updatedData: BlogModels[BlogModelsType.BLOG_PARTIAL_DATA]
  ): Promise<ApiResponse<string>>;

  /**
   * Deletes a blog by ID.
   * @param id - The ID of the blog to delete.
   * @returns A promise resolving to a confirmation message wrapped in an ApiResponse.
   */
  deleteBlog(id: string): Promise<ApiResponse<string>>;

  /**
   * Adds a reaction to a specific blog.
   * @param id - The ID of the blog to react on.
   * @param reactionType - The type of reaction.
   * @returns A promise resolving to a confirmation message wrapped in an ApiResponse.
   */
  reactOnBlog(
    id: string,
    reactionType: ReactionType
  ): Promise<ApiResponse<string>>;

  /**
   * Adds a comment to a specific blog.
   * @param id - The ID of the blog.
   * @param text - The comment text.
   * @returns A promise resolving to a confirmation message wrapped in an ApiResponse.
   */
  commentOnBlog(id: string, text: string): Promise<ApiResponse<string>>;

  /**
   * Updates a comment on a specific blog.
   * @param blogId - The ID of the blog.
   * @param commentId - The ID of the comment to update.
   * @param text - The new comment text.
   * @returns A promise resolving to a confirmation message wrapped in an ApiResponse.
   */
  updateBlogComment(
    blogId: string,
    commentId: string,
    text: string
  ): Promise<ApiResponse<string>>;

  /**
   * Deletes a comment from a specific blog.
   * @param blogId - The ID of the blog.
   * @param commentId - The ID of the comment to delete.
   * @returns A promise resolving to a confirmation message wrapped in an ApiResponse.
   */
  deleteBlogComment(
    blogId: string,
    commentId: string
  ): Promise<ApiResponse<string>>;
}
