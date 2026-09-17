import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081/api",
});

// Attach JWT to every outgoing request, if one is stored
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid tokens globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login?sessionExpired=true";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;