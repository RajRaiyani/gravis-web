import axios from "axios";
import { serverDetails } from "@/config/env";


const instance = axios.create({
  baseURL: serverDetails.serverProxyURL,
});


instance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default instance;