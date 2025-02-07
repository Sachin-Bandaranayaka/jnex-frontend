import axios from "axios";
import Cookies from "js-cookie";
import axiosInstance from "./axios.instances";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/api/auth/login`,
        credentials
      );
      if (response.data.accessToken) {
        // Store token in cookie and full response in localStorage
        Cookies.set("accessToken", response.data.accessToken);
        Cookies.set("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        console.error("[authService] No refresh token found!");
        throw new Error("No refresh token available.");
      }

      console.log("[authService] Sending refresh request...");
      const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
        refreshToken,
      });

      console.log("[authService] New tokens received:", response.data);

      Cookies.set("accessToken", response.data.accessToken);
      Cookies.set("refreshToken", response.data.refreshToken);

      return response.data;
    } catch (error) {
      console.error("[authService] Refresh token request failed:", error);
      throw error;
    }
  },

  logout(): void {
    Cookies.remove("accessToken");
    localStorage.removeItem("user");
  },

  getCurrentUser(): LoginResponse | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
};
