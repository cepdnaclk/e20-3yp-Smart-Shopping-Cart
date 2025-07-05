/**
 * useAuthForm - Custom React hook for managing authentication form states and logic.
 * Handles login, signup, password reset, and forgot password flows.
 * Maintains form field states, validation, loading status, error/success messages, and submission handlers.
 */

import { useState, useCallback } from "react";
import {
    LoginFormData,
    SignupFormData,
    ForgotPasswordFormData,
    ResetPasswordFormData,
} from "../types/Auth";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

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

    // Form input values for the signup form, including personal details and account credentials
    const [signupData, setSignupData] = useState<SignupFormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        nic: "",
        role: "",
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

    const { login, register } = useAuth();

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
     * Submits login form data to the login service.
     * @param e - Form submission event
     */
    const handleSignupChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setSignupData((prev) => {
                const newData = { ...prev, [name]: value };

                // Auto-fill confirm password when password is being typed
                if (
                    name === "password" &&
                    prev.confirmPassword === "" &&
                    value.length > 0
                ) {
                    return { ...newData, confirmPassword: value };
                }

                return newData;
            });
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
     * Displays success or error messages depending on the result.
     * @param e - Login form submission event
     */
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            await login(loginData.username, loginData.password);
            setSuccess("Successfully logged in!");
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please check your credentials and try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Submits signup form data to the authentication service.
     * Performs validation checks (e.g., password match and minimum length) before sending.
     * On success, switches to login mode and pre-fills login email.
     * @param e - Signup form submission event
     */
    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        if (signupData.password !== signupData.confirmPassword) {
            setError(
                "Passwords do not match. Please ensure both password fields are identical."
            );
            setIsLoading(false);
            return;
        }

        if (signupData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setIsLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...registrationData } = signupData;
            await register(registrationData);
            setSuccess(
                "Account created successfully! Please log in with your credentials."
            );

            setTimeout(() => {
                setAuthMode("login");
                setLoginData({
                    username: signupData.email,
                    password: "",
                });
            }, 1500);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
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

        try {
            await authService.forgotPassword(forgotPasswordData);
            setSuccess("Reset code sent to your email! Please check your inbox.");
            setResetPasswordData((prev) => ({
                ...prev,
                email: forgotPasswordData.email,
            }));
            setAuthMode("reset");
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
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
            setError("Password must be at least 6 characters long.");
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
                    username: resetPasswordData.email,
                    password: "",
                });
            }, 1500);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
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
