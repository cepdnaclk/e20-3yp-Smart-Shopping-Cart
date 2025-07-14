// api.ts
import axios from "axios";

// Base URL for API requests; switch to production URL when deploying
const API_BASE_URL = "http://localhost:4020/api"; // Use 'https://server-production-6f21.up.railway.app/api' in production

// Create axios instance with base URL and JSON content-type headers
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Attaches JWT access token from localStorage to Authorization header on every request, if available.
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

/**
 * Intercepts API responses to handle 401 Unauthorized errors by refreshing JWT tokens.
 * Retries the original request once after successful token refresh.
 * If refresh fails, clears all tokens and rejects the promise, effectively logging out the user.
 *
 * The backend expects a POST to /user/auth/refresh with Authorization: Bearer <refresh_token> header.
 * This endpoint is handled by backend security config and UserServiceImpl.refreshToken.
 */
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // Check if error is 401 and retry hasn't happened yet
//         if (
//             (error.response?.status === 401 || error.response?.status === 403) &&
//             !originalRequest._retry &&
//             !originalRequest.url.includes("/auth/refresh")
//         ) {
//             originalRequest._retry = true;
//             try {
//                 // Attempt to refresh tokens using refresh token from localStorage
//                 const refreshToken = localStorage.getItem("refresh_token");
//                 if (!refreshToken) {
//                     // No refresh token available, session is definitely expired
//                     console.error("No refresh token found. Logging out.");
//                     localStorage.removeItem("access_token");
//                     localStorage.removeItem("refresh_token");
//                     // Optionally, redirect to login page here if this is a React/framework context
//                     return Promise.reject(
//                         new Error("Session expired. Please log in again.")
//                     );
//                 }

//                 // Send POST to /user/auth/refresh with Authorization: Bearer <refresh_token>
//                 const response = await api.post(
//                     "/user/auth/refresh",
//                     {},
//                     {
//                         headers: { Authorization: `Bearer ${refreshToken}` },
//                     }
//                 );

//                 // Store new tokens in localStorage using consistent keys
//                 localStorage.setItem("access_token", response.data.access_token);
//                 localStorage.setItem("refresh_token", response.data.refresh_token);

//                 // Update the authorization header for the original request with the new access token
//                 originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;

//                 // Retry the original request with the new access token
//                 return api(originalRequest);
//             } catch (err) {
//                 console.error("Token refresh failed. Logging out.", err);
//                 // If refresh fails, clear all tokens and reject the promise
//                 // localStorage.removeItem('access_token');
//                 // localStorage.removeItem('refresh_token');
//                 // Optionally, redirect to login page here
//                 return Promise.reject(
//                     new Error("Session expired. Please log in again.")
//                 );
//             }
//         }

//         // If not 401 or retry failed, propagate error
//         return Promise.reject(error);
//     }
// );

export default api;
