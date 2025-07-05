/**
 * authService - Handles all API requests related to user authentication.
 * Includes methods for registration, login, password change/reset, logout, and retrieving the current user.
 */

import api from "./api";

export const authService = {
    /**
     * Registers a new user by sending user data to the server.
     * Saves token and user data to localStorage on success.
     * @param userData - Object containing user's personal and account details
     * @returns Response data from the registration endpoint
     */
    async register(userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phone: string;
        nic: string;
    }) {
        const response = await api.post("/auth/register", userData);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    },

    /**
     * Authenticates a user with email and password.
     * Stores the token and user info in localStorage upon successful login.
     * @param credentials - Object with email and password
     * @returns Response data from the login endpoint
     */
    async login(credentials: { email: string; password: string }) {
        const response = await api.post("/auth/login", credentials);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    },

    /**
     * Sends a request to update the user's password.
     * @param passwordData - Object containing old password and new password fields
     * @returns Promise resolving to API response
     */
    async changePassword(passwordData: {
        oldPassword: string;
        newPassword: string;
        confirmationPassword: string;
    }) {
        return api.patch("/users/changePassword", passwordData);
    },

    /**
     * Initiates the forgot password process by sending username and email.
     * Typically triggers an email with a reset code.
     * @param data - Object with username and email
     * @returns Promise resolving to API response
     */
    async forgotPassword(data: { username: string; email: string }) {
        return api.patch("/users/forgetPassword", data);
    },

    /**
     * Completes the password reset process using a reset code and new password.
     * @param resetData - Object containing email, reset code, and new password fields
     * @returns Promise resolving to API response
     */
    async resetPassword(resetData: {
        email: string;
        resetCode: string;
        changePasswordRequestDTO: {
            newPassword: string;
            confirmationPassword: string;
        };
    }) {
        return api.patch("/users/resetPassword", resetData);
    },

    /**
     * Retrieves the current user data stored in localStorage.
     * @returns Parsed user object if available, otherwise null
     */
    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);
        return null;
    },

    /**
     * Logs the user out by clearing token and user data from localStorage.
     */
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
};
