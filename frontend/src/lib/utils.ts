import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function displayContent(
  content: string,
  maxLength: number = 200
): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.slice(0, maxLength).trim() + "...";
}

const api = axios.create({
  baseURL: "https://backend.tempfordev03.workers.dev/api/v1", // Change this to your API's base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token (if available)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or from cookies/context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute); // Rounds up to the nearest minute
}

export function getUserIdFromToken(token: string | null): string | null {
  try {
    if (token == null) return null;
    const decoded: { id: string } = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
