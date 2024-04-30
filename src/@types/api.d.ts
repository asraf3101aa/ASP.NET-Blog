declare type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

declare type RequestOptions = {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
};

declare type ApiErrorLog = {
  title: string;
  message: string;
};

declare type ApiErrorsResponse = {
  errors: ApiErrorLog[];
};

declare type ApiDataResponse<T> = {
  data: T;
};

declare type ApiResponseStatusWithErrors = {
  status: number;
  errors: ApiErrorLog[];
};

declare type ApiResponse<T> = T | ApiResponseStatusWithErrors;
