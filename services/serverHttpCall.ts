// serverHttpCall.ts (SSR version)

import axios from "axios";
import { serverDetails } from "@/config/env";
import { cookies } from "next/headers";

const instance = axios.create({
  baseURL: serverDetails.serverProxyURL,
});

instance.interceptors.request.use(
  async (config) => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log("SSR cookie read error:", e);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error)
);

export default instance;
