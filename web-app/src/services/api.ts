/**
 * api - Axios instance configured for API requests with base URL and JSON headers.
 * Automatically attaches JWT access token from localStorage to Authorization header.
 * Includes response interceptor to handle 401 Unauthorized errors by attempting token refresh.
 */

import axios from 'axios';

// Base URL for API requests; switch to production URL when deploying
const API_BASE_URL = 'http://localhost:5000/api';  // Use 'https://server-production-6f21.up.railway.app/api' in production

// Create axios instance with base URL and JSON content-type headers
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Attaches JWT access token from localStorage to Authorization header on every request, if available.
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Intercepts API responses to handle 401 Unauthorized errors by refreshing JWT tokens.
 * Retries the original request once after successful token refresh.
 * If refresh fails, rejects the promise with the error.
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

         // Check if error is 401 and retry hasn't happened yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {

                // Attempt to refresh tokens using refresh token from localStorage
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await api.post('/auth/refresh-token', {}, {
                    headers: { Authorization: `Bearer ${refreshToken}` }
                });

                // Store new tokens in localStorage
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                return api(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }

        // If not 401 or retry failed, propagate error
        return Promise.reject(error);
    }
);

export default api;
