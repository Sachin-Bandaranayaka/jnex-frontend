import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Log the request configuration (useful for debugging)
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      data: config.data,
    });

    // Get the auth token from cookies
    const authToken = Cookies.get("authToken");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle unauthorized errors (401)
    if (error.response?.status === 401) {
      // Clear the auth token
      Cookies.remove("authToken");

      // Redirect to login page if we're in the browser
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export { api };
