// import axios from "axios";
// import Cookies from "js-cookie";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// export interface LoginCredentials {
//   username: string;
//   password: string;
// }

// export interface LoginResponse {
//   accessToken: string;
//   user: {
//     id: string;
//     username: string;
//     role: string;
//   };
// }

// export const authService = {
//   async login(credentials: LoginCredentials): Promise<LoginResponse> {
//     try {
//       const response = await axios.post(
//         `${API_URL}/api/auth/login`,
//         credentials,
//         {
//           withCredentials: true,
//         }
//       );

//       if (response.data.accessToken) {
//         // Store accessToken in cookie and full response in localStorage
//         Cookies.set("accessToken", response.data.accessToken);
//         localStorage.setItem("user", JSON.stringify(response.data));
//       }
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   async logout(): Promise<void> {
//     try {
//       await axios.post(
//         `${API_URL}/api/auth/logout`,
//         {},
//         { withCredentials: true }
//       );
//       Cookies.remove("accessToken");
//       localStorage.removeItem("user");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   },

//   getCurrentUser(): LoginResponse | null {
//     const userStr = localStorage.getItem("user");
//     if (userStr) {
//       return JSON.parse(userStr);
//     }
//     return null;
//   },
// };

import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an Axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Axios interceptor for handling expired tokens
apiClient.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        const newAccessToken = await authService.refreshToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); // Retry the failed request
      } catch (refreshError) {
        console.error("Failed to refresh token, logging out...");
        authService.logout();
        window.location.href = "/login"; // Redirect to login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post(
        `${API_URL}/api/auth/login`,
        credentials,
        {
          withCredentials: true, // Ensures cookies are sent/received
        }
      );

      if (response.data.accessToken) {
        Cookies.set("accessToken", response.data.accessToken, { secure: true });
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async refreshToken(): Promise<string> {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/refresh-token`,
        {},
        { withCredentials: true } // Ensure cookies are sent
      );

      if (response.data.accessToken) {
        Cookies.set("accessToken", response.data.accessToken, { secure: true });
        return response.data.accessToken;
      }

      throw new Error("Failed to refresh token");
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      Cookies.remove("accessToken");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  getCurrentUser(): LoginResponse["user"] | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};
