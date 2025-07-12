import api from "./api";
import {
    UserRole, // Assuming UserRole is available for signup
} from "../../types/Auth";

export const authService = {
    
    /**
     * Registers a new user by sending user data to the server.
     * This endpoint typically requires an existing authenticated user (e.g., ADMIN)
     * to perform the registration, as indicated by the 'Authorization' header requirement
     * in the API documentation for POST /user/profile/register.
     * The backend generates the username and password, which are returned in the response.
     * This method does NOT store tokens, as the registration endpoint does not return them.
     * @param userData - Object containing user's personal details and role
     * @returns Response data from the registration endpoint, including generated username and password
     */
    async register(userData: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        nic: string;
        role: UserRole;
    }) {
        const response = await api.post("/user/profile/register", userData);
        return response.data;
    },

    /**
     * Authenticates a user with username and password.
     * Stores the access_token, refresh_token, and user info in localStorage upon successful login.
     * @param credentials - Object with username and password
     * @returns Response data from the login endpoint, including tokens and user role
     */
    async login(credentials: { username: string; password: string }) {
        const response = await api.post("/user/auth/login", credentials);
        if (response.data.access_token) {
            localStorage.setItem("access_token", response.data.access_token);
            if (response.data.refresh_token) {
                localStorage.setItem("refresh_token", response.data.refresh_token);
            }
        }
        return response.data;
    },

    // --- Endpoints below are NOT explicitly defined in the provided User Service API Endpoints ---
    // However, they are kept as per your request, with improved documentation.

    /**
     * Sends a request to update the user's password.
     * This endpoint is not explicitly defined in the provided User Service API Endpoints.
     * It is assumed to be a PATCH request to '/users/changePassword'.
     * Requires a valid access token in the Authorization header.
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
     * This endpoint is not explicitly defined in the provided User Service API Endpoints.
     * It is assumed to be a PATCH request to '/users/forgetPassword'.
     * @param data - Object with username and email
     * @returns Promise resolving to API response
     */
    async forgotPassword(data: { username: string; email: string }) {
        return api.patch("/users/forgetPassword", data);
    },

    /**
     * Completes the password reset process using a reset code and new password.
     * This endpoint is not explicitly defined in the provided User Service API Endpoints.
     * It is assumed to be a PATCH request to '/users/resetPassword'.
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
     * Logs the user out by clearing access_token, refresh_token, and user data from localStorage.
     * This is a client-side action and does not require an API call.
     */
    logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        // Optionally, you might want to redirect to the login page here
    },
};
