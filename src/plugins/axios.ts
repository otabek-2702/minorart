import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import { toast } from "vue3-toastify";
import router from "@/router";
import { clearUserSession } from "@/helpers";

// Define custom types for better type safety
interface ApiResponse<T = any> {
  data: T;
  message: string;
  status: number;
}


interface CustomAxiosError extends AxiosError {
  response?: AxiosResponse<{
    errors: {
      details: { field: string; messages: string[]; first_messagge: string }[];
    };
    message: string;
  }>;
}

// Environment variables type checking
const BASE_URL = import.meta.env.VITE_BASE_URL;
const DEV_MODE = import.meta.env.VITE_DEV_MODE == "1";

if (!BASE_URL)
  throw new Error("VITE_BASE_URL environment variable is not defined");

// Create an Axios instance with typed configuration
const axiosIns: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  // headers: {
  //   "Content-Type": "application/json",
  //   "Access-Control-Allow-Origin": "*",
  // },
});

// Request interceptor with proper typing
axiosIns.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error: CustomAxiosError) => {
    console.error("Request interceptor error:", error);

    return Promise.reject(error);
  }
);

// Constants for common status codes and messages
const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
} as const;

const ROUTES = {
  LOGIN: "/login",
  FORBIDDEN: "/forbidden",
  NOT_FOUND: "/404",
} as const;

/**
 * Clear user session data from localStorage
 */

/**
 * Handle redirection based on response error status.
 * @param {number} status - The HTTP status code from the response error.
 */
const handleRedirect = async (status: number): Promise<void> => {
  let path = "";

  switch (status) {
    case HTTP_STATUS.NOT_FOUND:
      path = ROUTES.NOT_FOUND;
      break;
    case HTTP_STATUS.UNAUTHORIZED:
      clearUserSession();
      path = ROUTES.LOGIN+"?daf" + `?to=${router.currentRoute.value.path}`;
      break;
    case HTTP_STATUS.FORBIDDEN:
      path = ROUTES.FORBIDDEN;
      break;
    default:
      return; // No redirection for other status codes
  }

  try {
    await router.push({ path });
    window.location.reload();
  } catch (err) {
    console.error("Navigation error:", err);
    window.location.reload();
  }
};

/**
 * Configure toast notification
 * @param {string} message - Message to display
 * @param {'error' | 'success' | 'info' | 'warning'} type - Toast type
 */
const showToast = (
  message: string,
  type: "error" | "success" | "info" | "warning" = "error"
): void => {
  toast(message, {
    theme: "auto",
    type,
    autoClose: 1700,
    position: "top-right",
    hideProgressBar: false,
  });
};

// Response interceptor with enhanced error handling
axiosIns.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>): AxiosResponse<ApiResponse> =>
    response,
  async (error: CustomAxiosError) => {
    if (error.response) {
      const errorMessage =
        error.response.data?.message ?? error.message ?? "Xatolik yuz berdi";

      // console.error('Error response:', {
      //   status: error.response.status,
      //   message: errorMessage,
      //   url: error.config?.url,
      // })
      // console.error('Error response:', error)

      showToast(errorMessage);

      // Handle redirection for specific status codes in production
      if (!DEV_MODE) await handleRedirect(error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      showToast("Tarmoq xatosi. Iltimos, internetingizni tekshiring.");
    } else {
      // Error in request configuration
      showToast("So'rov yuborishda xatolik yuz berdi");
    }

    return Promise.reject(error);
  }
);

export type { ApiResponse, CustomAxiosError };
export default axiosIns;
