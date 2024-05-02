/**
 * HTTP methods supported by the API.
 */
declare type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * Options for making a request to the API.
 *
 * @property {HttpMethod} method - The HTTP method to use (GET, POST, PUT, DELETE).
 * @property {Record<string, string>} headers - The headers to include with the request.
 * @property {string} [body] - The body of the request, typically used for POST or PUT.
 */
declare type RequestOptions = {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
};

/**
 * Represents an error log for API responses.
 *
 * @property {string} title - The title or category of the error.
 * @property {string} message - The error message or description.
 */
declare type ApiErrorLog = {
  title: string;
  message: string;
};

/**
 * Represents a collection of API errors.
 *
 * @property {ApiErrorLog[]} errors - An array of error logs.
 */
declare type ApiErrorsResponse = {
  errors: ApiErrorLog[];
};

/**
 * Represents a successful API response containing data.
 *
 * @template T - The type of the data contained in the response.
 * @property {T} data - The actual data returned by the API.
 */
declare type ApiDataResponse<T> = {
  data: T;
};

/**
 * Possible keys for error messages related to user-related fields.
 *
 * @enum {string}
 * @property {"firstName"} - Error related to the first name.
 * @property {"lastName"} - Error related to the last name.
 * @property {"email"} - Error related to the email.
 * @property {"password"} - Error related to the password.
 * @property {"confirmPassword"} - Error related to the password confirmation.
 */
declare type ErrorKey =
  | "firstName"
  | "lastName"
  | "email"
  | "password"
  | "confirmPassword";

/**
 * Represents an API response that includes errors along with the status code.
 *
 * @property {number} status - The HTTP status code of the response.
 * @property {ApiErrorLog[]} errors - An array of error logs.
 */
declare type ApiResponseStatusWithErrors = {
  status: number;
  errors: ApiErrorLog[];
};

/**
 * Represents an API response, which could be successful or contain errors.
 *
 * @template T - The type of the data in case of a successful response.
 * @property {T | ApiResponseStatusWithErrors} - Either the successful data or an error status with detailed errors.
 */
declare type ApiResponse<T> = T | ApiResponseStatusWithErrors;
