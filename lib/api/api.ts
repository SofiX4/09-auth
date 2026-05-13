// lib/api/api.ts
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

if (typeof window !== "undefined") {
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        window.location.href = "/sign-in"; // ← ВИПРАВЛЕНО: /sign-in замість /auth/login
      }
      return Promise.reject(error);
    }
  );
}
