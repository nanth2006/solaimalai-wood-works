import axios from "axios";

/**
 * Solaimalai Wood Works - Centralized Production API Configuration
 * 
 * Configured for Render Backend -> Vercel Frontend communication.
 * To point to your Render backend, either update RENDER_BACKEND_URL below
 * or provide VITE_API_URL in your environment.
 */
export const RENDER_BACKEND_URL =
  (import.meta.env.VITE_API_URL || "https://solaimalai-wood-works-backend.onrender.com").replace(
    /\/api\/?$/,
    ""
  );

export const API_BASE_URL = `${RENDER_BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30s timeout to allow Render free tier spin-up
});

// Attach JWT token automatically to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized or token expired, clean up and handle gracefully
    if (error.response && error.response.status === 401) {
      const isAuthRequest = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/register");
      if (!isAuthRequest) {
        // Clear token if invalid on protected endpoints
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Utility helper to convert stored image paths into full display URLs.
 * Handles Base64 data URIs, absolute URLs (HTTPS), and backend relative paths (e.g. /uploads/image.jpg).
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=800&q=80";
  }

  // If already full URL or Base64 data URI
  if (
    imagePath.startsWith("data:") ||
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  // Prepend Render backend URL for relative paths like /uploads/image.jpg
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${RENDER_BACKEND_URL}${cleanPath}`;
};

export default api;