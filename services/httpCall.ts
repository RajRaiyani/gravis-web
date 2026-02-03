import axios from "axios";
import { serverDetails } from "@/config/env";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: serverDetails.serverProxyURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const guestId = localStorage.getItem("guest_id");
    if (guestId) {
      config.headers["x-guest-id"] = guestId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,

  (error) => {
    console.log(error);
    if (
      error.response.status === 401 &&
      error.response.data.code === "unauthorized"
    ) {
      const redirectUrl = encodeURIComponent(
        `${window.location.pathname}${window.location.search}${window.location.hash}`
      );
      location.href = `/login?redirect_url=${redirectUrl}`;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    if (error.response.status === 403) {
      toast.error("You are not allowed to access this resource");
      return Promise.reject({
        code: "forbidden",
        message: "You are not authorized to access this resource",
      });
    }

    if (error.response.status === 500) {
      toast.error("Internal server error");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
