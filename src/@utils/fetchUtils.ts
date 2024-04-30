import { ApiResponseStatus } from "@/@enums/api.enum";
import { ILocalStorage } from "@/storage/ILocalStorage";

/**
 * Returns the headers required for an API request.
 *
 * @param {boolean} requiresAuth - Indicates whether the request requires authentication.
 * @param {ILocalStorage} localStorageClient - Represents an instance of `LocalStorage` for fetching `access_token` if `requiresAuth` is true.
 * @returns {Record<string, string>} An object containing the headers for the API request.
 */
export const getHeaders = (
  requiresAuth: boolean,
  localStorageClient: ILocalStorage
): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (requiresAuth) {
    const access_token = localStorageClient.getAccessToken();
    if (access_token) {
      headers["Authorization"] = `Bearer ${access_token}`;
    }
  }
  return headers;
};

/**
 * Processes the API response, parsing the JSON data if the response is OK,
 * or extracting error information otherwise.
 *
 * @template T The type of data expected in the successful response.
 * @param {Response} response - The response from a fetch request.
 * @returns {Promise<ApiResponse<T>>} The parsed response data or error information.
 */
export const getApiResponse = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  if (response.ok) {
    const result: ApiDataResponse<T> = await response.json();
    return result.data as T;
  } else {
    const status: number = response.status;

    const errorsResponse: ApiErrorsResponse = await response.json();
    const errors: ApiErrorLog[] = errorsResponse.errors;

    const responseStatusWithErrors: ApiResponseStatusWithErrors = {
      status,
      errors,
    };
    return responseStatusWithErrors;
  }
};

/**
 * Generates an error status response based on a thrown exception.
 *
 * @param {unknown} error - The error that was thrown.
 * @returns {ApiResponseStatusWithErrors} The error status response.
 */
export const getStatusWithErrorsFromException = (
  error: unknown
): ApiResponseStatusWithErrors => {
  const errorInstance = error as Error;
  const errorLog: ApiErrorLog = {
    title: errorInstance.name,
    message: errorInstance.message,
  };
  const responseStatusWithErrors = {
    status: ApiResponseStatus.INTERNAL_SERVER_ERROR,
    errors: [errorLog],
  };
  return responseStatusWithErrors;
};
