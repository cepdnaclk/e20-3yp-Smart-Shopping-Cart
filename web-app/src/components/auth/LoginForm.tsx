// components/LoginForm.tsx
import React from "react";
import FormField from "./FormField";
import { LoginFormData } from "../../types/Auth";

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
                label="Username or Email Address"
                name="username"
                type="text"
                value={formData.username}
                onChange={onChange}
                placeholder="Enter your username or email"
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
            <div style={{ marginTop: "-10px", marginBottom: "15px" }}>
                <button
                    type="button"
                    onClick={onForgotPassword}
                    style={{
                        display: "flex",
                        padding: 0,
                        background: "none",
                        alignSelf: "flex-start",
                        border: "none",
                        color: "#2a41e8",
                        fontSize: "14px",
                        cursor: "pointer",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.color = "#1e30c2";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.color = "#2a41e8";
                    }}
                >
                    Forgot your password?
                </button>
            </div>
            <button
                type="button"
                onClick={onSubmit}
                disabled={isLoading}
                style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: isLoading ? "#9e9e9e" : "#2a41e8",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    marginTop: "10px",
                }}
                onMouseOver={(e) => {
                    if (!isLoading) {
                        e.currentTarget.style.backgroundColor = "#1e30c2";
                    }
                }}
                onMouseOut={(e) => {
                    if (!isLoading) {
                        e.currentTarget.style.backgroundColor = "#2a41e8";
                    }
                }}
            >
                {isLoading ? "Signing In..." : "Sign In"}
            </button>
        </div>
    );
};

export default LoginForm;
