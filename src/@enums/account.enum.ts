// Enum representing different account model types
export enum AccountModelsType {
  IDENTITY_USER = "IdentityUser",
  USER = "User",
  POPULAR_BLOGGER = "PopularBlogger",
  AUTH_TOKEN = "AuthToken",
  USER_REGISTER = "UserRegister",
  ACCOUNT_REGISTER = "AccountRegister",
  USER_LOGIN = "UserLogin",
  CHANGE_PASSWORD = "ChangePassword",
  EMAIL_MODEL = "EmailModel",
  CONFIRM_PASSWORD = "ConfirmPassword",
  USER_UPDATE = "UserUpdate",
}

// Enum representing different account module's api endpoints
export enum AccountEndpointPaths {
  ACCOUNT_CONFIRM = "confirm",
  ACCOUNT_CONFIRM_RESEND = "confirm/resend",
  USER_LOGIN = "login",
  PASSWORD_FORGOT = "password/forgot",
  PASSWORD_CONFIRM = "password/confirm",
  EMAIL_UPDATE = "email",
  EMAIL_CONFIRM = "email/confirm",
  CHANGE_PASSWORD = "password",
}

export enum RetrieveEmailForAction {
  RESET_PASSWORD = "Forgot Password?",
  CHANGE_EMAIL = "Change Email",
}
