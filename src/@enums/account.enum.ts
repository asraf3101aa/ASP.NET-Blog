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
  RESET_PASSWORD = "ResetPassword",
  USER_UPDATE = "UserUpdate",
}

// Enum representing different account module's api endpoints
export enum AccountEndpointPaths {
  USER_REGISTER = "register",
  USER_LOGIN = "login",
  EMAIL_CONFIRM = "email/confirm",
  FORGOT_PASSWORD = "password/forgot",
  PASSWORD_RESET = "password/reset",
  UPDATE = "update",
  DELETE = "delete",
  PROFILE = "profile",
  EMAIL_CONFIRMATION_RESEND = "email/confirmation/resend",
  EMAIL_UPDATE = "email/update",
  PASSWORD_UPDATE = "password/update",
}
