import axios from "axios";
import Cookies from "js-cookie";
import { authService } from "./auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// To prevent multiple refresh requests
let isRefreshing = false;
let failedRequestsQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 and if the request is already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("[Interceptor] 401 detected, attempting token refresh...");
      originalRequest._retry = true;

      // If another request is already refreshing the token, wait for it
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const { accessToken } = await authService.refreshToken();

        // Store the new token
        Cookies.set("accessToken", accessToken);

        // Retry all queued requests
        failedRequestsQueue.forEach((req) => req.resolve(accessToken));
        failedRequestsQueue = [];

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("[Interceptor] Refresh token failed:", refreshError);

        failedRequestsQueue.forEach((req) => req.reject(refreshError));
        failedRequestsQueue = [];

        authService.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
