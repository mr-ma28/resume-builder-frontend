import axios from "axios";
import Cookies from "js-cookie";

// ✅ Create reusable axios instance
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach JWT token from cookies for every request
axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 🔴 Handle request configuration errors
    console.error("Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// ✅ Global response interceptor (optional but useful)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔐 Handle unauthorized access or expired tokens
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("⚠️ Unauthorized or expired token — clearing cookies.");
      Cookies.remove("token");
      Cookies.remove("user");
      // Optionally redirect user
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } else {
      console.error("Axios Response Error:", error);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
