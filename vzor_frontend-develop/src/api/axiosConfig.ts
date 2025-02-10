import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import Cookies from 'js-cookie';
import { BASE_URL } from "../constants/apiConstants";

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

interface CustomAxiosResponse extends AxiosResponse {
  customHeaders?: {
    [key: string]: string;
  };
}

// Флаг, указывающий идет ли сейчас процесс обновления токена
let isRefreshing = false;

// Очередь запросов, которые ожидают обновления токена
let failedQueue: Array<{
  resolve: (token: string) => void;  
  reject: (error: any) => void;      
}> = [];

// Обработка очереди запросов после получения нового токена
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// Функция обновления токена
export const refreshToken = async () => {
  try {
    // Получаем refresh token из localStorage
    const refreshToken = localStorage.getItem("refresh_token");
    
    // Отправляем запрос на обновление токена
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken
    });
    
    // Получаем новый access token

    const newAccessToken = response.data.data['access_token'];
    
    // Сохраняем новый access token
    localStorage.setItem("token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    // При ошибке удаляем токены
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    throw error;
  }
};

export const createAxiosInstance = (): AxiosInstance => {
  const token = localStorage.getItem("token");

  const instance = axios.create({
    baseURL: BASE_URL,
    adapter: "xhr",
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  instance.interceptors.request.use((config) => {
    if (config && config.headers) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers["Content-Type"] = "application/json";
    }

    config.responseType = "json";
    return config;
  });

  instance.interceptors.response.use((response): CustomAxiosResponse => {
    const xhr = response.request;
    let parsedHeaders: { [key: string]: string } = {};

    if (xhr instanceof XMLHttpRequest) {
      const rawHeaders = xhr.getAllResponseHeaders();
      // Парсим raw headers в объект
      parsedHeaders = rawHeaders.split("\r\n").reduce((acc, current) => {
        const [name, value] = current.split(": ");
        if (name && value) {
          acc[name.toLowerCase()] = value;
        }
        return acc;
      }, {} as { [key: string]: string });
    }

    // Добавляем распарсенные заголовки к ответу
    return {
      ...response,
      customHeaders: parsedHeaders,
    };
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest?._retry) {
        
        // Если уже идет процесс обновления токена
        if (isRefreshing && originalRequest) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            // Когда получим новый токен
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        if (!originalRequest) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          processQueue(null, newToken);
          
          return instance(originalRequest);
        } catch (refreshError) {

          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosInstance = createAxiosInstance();
