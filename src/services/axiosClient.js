import axios from "axios";
export const axiosClient = axios.create({
  baseURL: "https://lms-server-2xk1.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 100000,
});
axiosClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error?.response);
  }
);
