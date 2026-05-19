import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8787";

export const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
