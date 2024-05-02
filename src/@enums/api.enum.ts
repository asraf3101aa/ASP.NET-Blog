// Enum representing different api response statuses
export enum ApiResponseStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

// Enum representing different types of HTTP methods during API calls
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// Enum representing different api controllers
export enum ApiEndpointPaths {
  ACCOUNT = "account",
  ADMIN = "admin",
  BLOG = "blog",
}
