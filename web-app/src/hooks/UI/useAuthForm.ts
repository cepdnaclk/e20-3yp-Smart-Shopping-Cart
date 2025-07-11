/**
 * useAuthForm - Custom React hook for managing authentication form states and logic.
 * Handles login, signup, password reset, and forgot password flows.
 * Maintains form field states, validation, loading status, error/success messages, and submission handlers.
 */

import { useState, useCallback } from "react";
import {
    LoginFormData,
    SignupFormData, // This type will be adjusted to match backend registration
    ForgotPasswordFormData,
    ResetPasswordFormData,
    UserRole, // Assuming UserRole is available for signup
} from "../../types/Auth";
import { authService } from "../services/authService";
import { useAuthContext } from "../context/useAuthContext";

export const useAuthForm = () => {
    // Tracks the current authentication mode ('login', 'signup', 'forgot', 'reset')
    const [authMode, setAuthMode] = useState<
        "login" | "signup" | "forgot" | "reset"
    >("login");

    // Indicates whether a form submission is currently processing
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Error message to show after failed submission
    const [error, setError] = useState<string>("");

    // Success message to show after successful submission
    const [success, setSuccess] = useState<string>("");

    // Form input values for the login form: username and password
    const [loginData, setLoginData] = useState<LoginFormData>({
        username: "",
        password: "",
    });

    // Form input values for the signup form, adjusted to match authService.register payload
    const [signupData, setSignupData] = useState<SignupFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "", 
        nic: "",
        role: "" as UserRole, // Ensure role is typed as UserRole
    });

    // Input values for the forgot password form (username and associated email)
    const [forgotPasswordData, setForgotPasswordData] =
        useState<ForgotPasswordFormData>({
            username: "",
            email: "",
        });

    // Input values for resetting the password, including email, reset code, and new password fields
    const [resetPasswordData, setResetPasswordData] =
        useState<ResetPasswordFormData>({
            email: "",
            resetCode: "",
            newPassword: "",
            confirmationPassword: "",
        });

    const { login } = useAuthContext(); // Only need 'login' from useAuth as 'register' is called directly via authService

    /**
     * Updates login form input values on change.
     * @param e - Input change event from login form fields
     */
    const handleLoginChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setLoginData((prev) => ({ ...prev, [name]: value }));
        },
        []
    );

    /**
     * Updates signup form input values on change.
     * @param e - Input change event from signup form fields (can be input or select)
     */
    const handleSignupChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setSignupData((prev) => ({ ...prev, [name]: value }));
        },
        []
    );

    /**
     * Updates forgot password form input values on change.
     * @param e - Input change event from forgot password form fields
     */
    const handleForgotPasswordChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setForgotPasswordData((prev) => ({ ...prev, [name]: value }));
        },
        []
    );

    /**
     * Updates reset password form input values on change.
     * @param e - Input change event from reset password form fields
     */
    const handleResetPasswordChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setResetPasswordData((prev) => ({ ...prev, [name]: value }));
        },
        []
    );

    /**
     * Submits login form data to the authentication service.
     * Performs client-side validation before submission.
     * Displays success or error messages depending on the result.
     * @param e - Login form submission event
     */
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        // Client-side validation for login
        if (!loginData.username.trim() || !loginData.password.trim()) {
            setError("Username and password are required.");
            setIsLoading(false);
            return;
        }

        try {
            await login(loginData.username, loginData.password); // Assuming useAuth's login takes username, password directly
            setSuccess("Successfully logged in!");
            // Clear form fields on successful login
            setLoginData({ username: "", password: "" });
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(
                err.response?.data?.message ||
                "Login failed. Please check your credentials and try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Submits signup form data to the authentication service.
     * Performs validation checks (e.g., email format, phone/NIC length) before sending.
     * On success, clears form and shows success message.
     * @param e - Signup form submission event
     */
    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        // Client-side validation for signup
        if (!signupData.firstName || !signupData.lastName || !signupData.email || !signupData.phoneNumber || !signupData.nic || !signupData.role) {
            setError('All fields are required.');
            setIsLoading(false);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
            setError('Please enter a valid email address.');
            setIsLoading(false);
            return;
        }
        if (!/^\d{8,20}$/.test(signupData.phoneNumber)) {
            setError('Phone number must be between 8 and 20 digits.');
            setIsLoading(false);
            return;
        }
        if (!/^\d{10,12}$/.test(signupData.nic)) {
            setError('NIC must be between 10 and 12 digits.');
            setIsLoading(false);
            return;
        }

        try {
            // authService.register expects firstName, lastName, email, phoneNumber, nic, role
            const response = await authService.register(signupData);
            setSuccess(response.message || `User registered successfully! Username: ${response.username}, Password: ${response.password}`);
            // Clear form fields on successful registration
            setSignupData({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                nic: "",
                role: "" as UserRole,
            });
        } catch (err: any) {
            console.error('Registration failed:', err);
            setError(
                err.response?.data?.message ||
                "Registration failed. Please check your information and try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Submits forgot password form to request a reset code.
     * On success, switches to reset password mode and pre-fills email for reset.
     * @param e - Forgot password form submission event
     */
    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        // Client-side validation for forgot password
        if (!forgotPasswordData.username.trim() || !forgotPasswordData.email.trim()) {
            setError('Username and email are required.');
            setIsLoading(false);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordData.email)) {
            setError('Please enter a valid email address.');
            setIsLoading(false);
            return;
        }

        try {
            await authService.forgotPassword(forgotPasswordData);
            setSuccess("Reset code sent to your email! Please check your inbox.");
            setResetPasswordData((prev) => ({
                ...prev,
                email: forgotPasswordData.email,
            }));
            setAuthMode("reset");
        } catch (err: any) {
            console.error('Forgot password failed:', err);
            setError(
                err.response?.data?.message ||
                "Failed to send reset code. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Submits reset password form data to update the user password.
     * Validates new password fields before sending.
     * On success, switches to login mode and pre-fills login email.
     * @param e - Reset password form submission event
     */
    const handleResetPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        // Client-side validation for reset password
        if (!resetPasswordData.email.trim() || !resetPasswordData.resetCode.trim() || !resetPasswordData.newPassword.trim() || !resetPasswordData.confirmationPassword.trim()) {
            setError('All fields are required.');
            setIsLoading(false);
            return;
        }

        if (
            resetPasswordData.newPassword !== resetPasswordData.confirmationPassword
        ) {
            setError(
                "Passwords do not match. Please ensure both password fields are identical."
            );
            setIsLoading(false);
            return;
        }

        if (resetPasswordData.newPassword.length < 6) {
            setError("New password must be at least 6 characters long.");
            setIsLoading(false);
            return;
        }

        try {
            await authService.resetPassword({
                email: resetPasswordData.email,
                resetCode: resetPasswordData.resetCode,
                changePasswordRequestDTO: {
                    newPassword: resetPasswordData.newPassword,
                    confirmationPassword: resetPasswordData.confirmationPassword,
                },
            });
            setSuccess(
                "Password reset successful! You can now login with your new password."
            );
            setTimeout(() => {
                setAuthMode("login");
                setLoginData({
                    username: resetPasswordData.email, // Assuming email can be used as username for login
                    password: "",
                });
            }, 1500);
        } catch (err: any) {
            console.error('Reset password failed:', err);
            setError(
                err.response?.data?.message ||
                "Failed to reset password. Please check your reset code and try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Switches between different authentication modes.
     * Also clears any existing success or error messages when switching.
     * @param mode - Target authentication mode to switch to ('login', 'signup', 'forgot', or 'reset')
     */
    const toggleAuthMode = useCallback(
        (mode: "login" | "signup" | "forgot" | "reset") => {
            setAuthMode(mode);
            setError("");
            setSuccess("");
        },
        []
    );

    return {
        authMode,
        isLoading,
        error,
        success,
        loginData,
        signupData,
        forgotPasswordData,
        resetPasswordData,
        handleLoginChange,
        handleSignupChange,
        handleForgotPasswordChange,
        handleResetPasswordChange,
        handleLoginSubmit,
        handleSignupSubmit,
        handleForgotPasswordSubmit,
        handleResetPasswordSubmit,
        toggleAuthMode,
    };
};
