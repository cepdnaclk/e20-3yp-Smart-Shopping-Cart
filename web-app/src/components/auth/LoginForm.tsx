import React from "react";
import FormField from "../form_fields/FormField";
import { LoginFormData } from "../../types/Auth";
import styles from "./LoginForm.module.css";

interface LoginFormProps {
    formData: LoginFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onForgotPassword: () => void;
    isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
    formData,
    onChange,
    onSubmit,
    onForgotPassword,
    isLoading,
}) => {
    return (
        <div>
            <FormField
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={onChange}
                placeholder="Enter your username"
                autoComplete="username"
            />
            <FormField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Enter your password"
                autoComplete="current-password"
            />
            <div className={styles.forgotPasswordContainer}>
                <button
                    type="button"
                    onClick={onForgotPassword}
                    className={styles.forgotPasswordButton}
                >
                    Forgot your password?
                </button>
            </div>
            <button
                type="button"
                onClick={onSubmit}
                disabled={isLoading}
                className={`${styles.submitButton} ${isLoading ? styles.disabledButton : styles.activeButton}`}
            >
                {isLoading ? "Signing In..." : "Sign In"}
            </button>
        </div>
    );
};

export default LoginForm;
