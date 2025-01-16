import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    console.log("API Request Config:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });

    const token = Cookies.get("authToken");
    console.log("Auth token from cookie:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Added Authorization header:", config.headers.Authorization);
    } else {
      console.warn("No auth token found in cookies");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      headers: response.headers,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("API Error Response:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return Promise.reject(error);
  }
);

export default api;
