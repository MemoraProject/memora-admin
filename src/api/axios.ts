import axios from "axios";
// import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.memora.vn/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    // Get the token from AsyncStorage
    const token = localStorage.getItem("adminToken");

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const apiRevenueCat = axios.create({
  baseURL: "https://api.revenuecat.com/v2",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer sk_PoETLiKhDSMHQoBmNNTcFUaFsEKMp`,
  },
});

export { apiRevenueCat };
export default api;
