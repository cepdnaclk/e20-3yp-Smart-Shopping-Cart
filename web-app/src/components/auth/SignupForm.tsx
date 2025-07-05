import React from 'react';
import FormField from './FormField';
import { SignupFormData } from '../../types/Auth';

interface SignupFormProps {
    formData: SignupFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({
    formData,
    onChange,
    onSubmit,
    isLoading
}) => {

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange({
            target: {
                name,
                value,
            },
        } as React.ChangeEvent<HTMLInputElement>); // 👈 Cast it to match the expected type
    };

    return (
        <div>
            <div style={{ display: "flex", gap: "15px", marginBottom: "0", marginTop: "10px" }}>
                <div style={{ flex: 1 }}>
                    <FormField
                        label="First Name"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={onChange}
                        placeholder="First name"
                        autoComplete="given-name"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormField
                        label="Last Name"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={onChange}
                        placeholder="Last name"
                        autoComplete="family-name"
                    />
                </div>
            </div>
            <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="your.email@example.com"
                autoComplete="email"
            />
            <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={onChange}
                placeholder="+94 77 123 4567"
                autoComplete="tel"
            />
            <FormField
                label="National Identity Card (NIC)"
                name="nic"
                type="text"
                value={formData.nic}
                onChange={onChange}
                placeholder="Enter your NIC number"
                autoComplete="off"
            />

            <select
                id="role"
                name="role"
                title='role'
                value={formData.role}
                onChange={handleSelectChange}
                required
                style={{
                    width: "100%",
                    color: "rgba(0, 0, 0, 0.75)",
                    backgroundColor: "rgba(235, 235, 235, 0.75)",
                    padding: "12px 15px",
                    fontSize: "16px",
                    border: "1px solid #dde2e5",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    outline: "none",
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#2a41e8";
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#dde2e5";
                }}
            >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>

            <FormField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Create a secure password (min. 6 characters)"
                autoComplete="new-password"
            />
            <FormField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={onChange}
                placeholder="Re-enter your password"
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
                {isLoading ? "Creating Account..." : "Create Account"}
            </button>
        </div>
    );
};

export default SignupForm;