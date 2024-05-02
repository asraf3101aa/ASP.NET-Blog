export interface IFetchAPI {
  /**
   * Sends a POST request to create a new resource.
   *
   * @template T - The type of the response data expected from the server.
   * @template U - The type of the data sent to the server.
   * @param {string} path - The endpoint to which the request is sent.
   * @param {U} data - The data to be sent to the server.
   * @returns {Promise<ApiResponse<T>>} A promise resolving to the response from the server.
   */
  post<T, U>(path: string, data: U): Promise<ApiResponse<T>>;

  /**
   * Sends a GET request to get a resource.
   *
   * @template T - The type of the response data expected from the server.
   * @param {string} path - The endpoint to which the request is sent.
   * @returns {Promise<ApiResponse<T>>} A promise resolving to the response from the server.
   */
  get<T>(path: string): Promise<ApiResponse<T>>;

  /**
   * Sends a PUT request to update an existing resource.
   *
   * @template T - The type of the response data expected from the server.
   * @template U - The type of the data sent to the server.
   * @param {string} path - The endpoint to which the request is sent.
   * @param {U} data - The data to be sent to the server for updating.
   * @returns {Promise<ApiResponse<T>>} A promise resolving to the response from the server.
   */
  update<T, U>(path: string, data: U): Promise<ApiResponse<T>>;

  /**
   * Sends a DELETE request to remove a resource.
   *
   * @param {string} path - The endpoint to which the request is sent.
   * @returns {Promise<ApiResponse<null>>} A promise resolving to the response from the server.
   */
  delete<T>(path: string): Promise<ApiResponse<T>>;
}
