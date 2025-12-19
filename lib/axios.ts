import axios from "axios";
import { env } from "./env";

export const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_SITE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
