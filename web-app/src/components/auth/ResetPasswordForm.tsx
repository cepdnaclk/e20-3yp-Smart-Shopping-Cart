import React from 'react';
import FormField from './FormField';
import { ResetPasswordFormData } from '../../types/Auth';

interface ResetPasswordFormProps {
    formData: ResetPasswordFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
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
                Enter the reset code sent to your email and create a new password.
            </p>

            <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Enter your email address"
                autoComplete="email"
            />

            <FormField
                label="Reset Code"
                name="resetCode"
                type="text"
                value={formData.resetCode}
                onChange={onChange}
                placeholder="Enter the 6-digit reset code"
                autoComplete="off"
            />

            <FormField
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={onChange}
                placeholder="Create a new password (min. 6 characters)"
                autoComplete="new-password"
            />

            <FormField
                label="Confirm New Password"
                name="confirmationPassword"
                type="password"
                value={formData.confirmationPassword}
                onChange={onChange}
                placeholder="Confirm your new password"
                autoComplete="new-password"
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
                {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>
        </div>
    );
};

export default ResetPasswordForm;