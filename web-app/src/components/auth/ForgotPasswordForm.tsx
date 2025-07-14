import React from 'react';
import FormField from '../form_fields/FormField';
import { ForgotPasswordFormData } from '../../types/Auth';
import styles from './ForgotPasswordForm.module.css';

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
            <p className={styles.infoText}>
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
                className={`${styles.submitButton} ${isLoading ? styles.disabledButton : styles.activeButton}`}
            >
                {isLoading ? "Sending Reset Code..." : "Send Reset Code"}
            </button>
        </div>
    );
};

export default ForgotPasswordForm;
