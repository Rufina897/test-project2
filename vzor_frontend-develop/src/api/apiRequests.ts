import { AxiosRequestConfig } from "axios";
import { axiosInstance } from "./axiosConfig";

// Добавляем интерфейс для расширенного ответа
interface ExtendedResponse<T> {
  data: T;
  headers: Record<string, string>;
}

export const createRequestFn = <Request, Response>(
  url: string,
  method: "get" | "post" | "put" | "delete"
) => {

  return async (
    params?: Request,
    config?: AxiosRequestConfig
  ): Promise<ExtendedResponse<Response>> => {
    try {
      const requestConfig: AxiosRequestConfig = {
        url,
        method,
        ...config,
      };

      if (method === "get") {
        requestConfig.params = params;
      } else {
        requestConfig.data = params;
      }

      const response = await axiosInstance.request<Response>(requestConfig);
      return {
        data: response.data,
        headers: response.headers as Record<string, string>,
      };
    } catch (error: any) {
      throw error?.response || error;
    }
  };
};
