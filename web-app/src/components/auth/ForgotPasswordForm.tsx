import React from 'react';
import FormField from './FormField';
import { ForgotPasswordFormData } from '../../types/Auth';

interface ForgotPasswordFormProps {
    formData: ForgotPasswordFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    formData,
    onChange,
    onSubmit,
    isLoading
}) => {
    return (
        <div>
            <p style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "20px",
                lineHeight: "1.5",
                textAlign: "center"
            }}>
                Enter your username and email address to receive a reset code.
            </p>

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
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Enter your email address"
                autoComplete="email"
            />

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
                {isLoading ? "Sending Reset Code..." : "Send Reset Code"}
            </button>
        </div>
    );
};

export default ForgotPasswordForm;