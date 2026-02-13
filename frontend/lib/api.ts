import axios, { AxiosError } from "axios";

export interface ApiError {
  message: string;
  status: number;
  field?: string;
}

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<{
      error?: string;
      message?: string;
      errors?: Record<string, string[]>;
    }>;

    if (axiosErr.response?.data?.error) {
      return axiosErr.response.data.error;
    }

    if (axiosErr.response?.data?.message) {
      return axiosErr.response.data.message;
    }

    if (axiosErr.response?.data?.errors) {
      const errors = axiosErr.response.data.errors;
      const firstField = Object.keys(errors)[0];
      if (firstField && errors[firstField]?.[0]) {
        return errors[firstField][0];
      }
    }

    switch (axiosErr.response?.status) {
      case 400:
        return "Bad request. Please check your input.";
      case 401:
        return "Unauthorized. Please log in again.";
      case 403:
        return "Forbidden. You don't have permission to do this.";
      case 404:
        return "Not found.";
      case 409:
        return "Conflict. This resource already exists.";
      case 422:
        return "Validation error. Please check your input.";
      case 500:
        return "Server error. Please try again later.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return axiosErr.message || "An error occurred. Please try again.";
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "An unexpected error occurred. Please try again.";
};

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }

    if (err.response?.status === 403) {
      const errorMsg = err.response?.data?.error || "Access forbidden";
    }

    return Promise.reject(err);
  },
);

export default api;
