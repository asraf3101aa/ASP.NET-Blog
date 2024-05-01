import {
  getApiResponse,
  getHeaders,
  getStatusWithErrorsFromException,
} from "@/@utils/fetchUtils";
import { IFetchAPI } from "./IFetchAPI";
import { HttpMethod } from "@/@enums/api.enum";
import { ILocalStorage } from "@/storage/ILocalStorage";

export class FetchAPI implements IFetchAPI {
  // Base URL from environment variable
  private _baseURL: string;
  private _localStorageClient: ILocalStorage;

  constructor(baseURL: string, localStorageClient: ILocalStorage) {
    this._baseURL = baseURL;
    this._localStorageClient = localStorageClient;
  }

  /**
   * Sends an HTTP request to the specified API endpoint.
   *
   * @template T - The expected type of the response data.
   * @param {string} path - The relative path of the API endpoint (e.g., '/users').
   * @param {HttpMethod} method - The HTTP method to use (e.g., 'GET', 'POST', 'PUT', 'DELETE').
   * @param {any} [data] - The request payload, if any. Optional, used for POST and PUT requests.
   * @param {boolean} [requiresAuth] - Whether authentication is required for this request. Default is false.
   * @returns {Promise<ApiResponse<T>>}  A promise resolving to the expected response type `T`, or list of `ApiErrorLog`.
   */
  private _sendRequest = async <T, U>(
    path: string,
    method: HttpMethod,
    data?: U,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> => {
    const apiEndpoint = `${this._baseURL}/${path}`;
    const options: RequestOptions = {
      method,
      headers: getHeaders(requiresAuth, this._localStorageClient),
    };

    if (data) {
      // Include data in request body
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(apiEndpoint, options);
      return getApiResponse<T>(response);
    } catch (error: unknown) {
      return getStatusWithErrorsFromException(error);
    }
  };

  post<T, U>(path: string, data: U): Promise<ApiResponse<T>> {
    return this._sendRequest<T, U>(path, HttpMethod.POST, data);
  }

  get<T>(path: string): Promise<ApiResponse<T>> {
    return this._sendRequest<T, undefined>(path, HttpMethod.GET);
  }

  update<T, U>(path: string, data: U): Promise<ApiResponse<T>> {
    return this._sendRequest<T, U>(path, HttpMethod.PUT, data);
  }

  delete(path: string): Promise<ApiResponse<null>> {
    return this._sendRequest<null, undefined>(path, HttpMethod.DELETE);
  }
}
