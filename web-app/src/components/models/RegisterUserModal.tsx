import React from 'react';
import { X, UserPlus } from 'lucide-react';
import { UserRole } from '../../types/Auth';
import FormField from '../form_fields/FormField';
import SelectField from '../form_fields/SelectField';
import styles from './RegisterUserModal.module.css'; // Import the CSS Module

interface RegisterUserModalProps {
    isOpen: boolean;
    signupData: any;
    isLoading: boolean;
    error: string | null;
    success: string | null;
    roleOptions: Array<{ value: UserRole; label: string }>;
    onClose: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const RegisterUserModal: React.FC<RegisterUserModalProps> = ({
    isOpen,
    signupData,
    isLoading,
    error,
    success,
    roleOptions,
    onClose,
    onChange,
    onSubmit
}) => {
    if (!isOpen) return null;

    const formFields = [
        { name: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'Enter first name' },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Enter last name' },
        { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter email address' },
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true, placeholder: 'Enter phone number' },
        { name: 'nic', label: 'NIC', type: 'text', required: true, placeholder: 'Enter NIC number' },
    ];

    const messageBoxClasses = `${styles.messageBox} ${success ? styles.successMessage : ''} ${error ? styles.errorMessage : ''}`;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} scrollable-area`} onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className={styles.closeButton}
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                <div className={styles.header}>
                    <div className={styles.iconContainer}>
                        <UserPlus size={24} color="#2563eb" />
                    </div>
                    <div>
                        <h2 className={styles.title}>Register New User</h2>
                        <p className={styles.subtitle}>Create a new user account</p>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {(success || error) && (
                    <div className={messageBoxClasses}>
                        <div className={`${styles.statusIcon} ${success ? styles.successIconBg : styles.errorIconBg}`}>
                            <span className={styles.statusIconText}>{success ? '✓' : '!'}</span>
                        </div>
                        {success || error}
                    </div>
                )}

                <form onSubmit={onSubmit} className={styles.form}>
                    {formFields.map((field) => (
                        <FormField
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            type={field.type}
                            value={signupData[field.name] || ''}
                            onChange={onChange}
                            required={field.required}
                            placeholder={field.placeholder}
                        />
                    ))}

                    <SelectField
                        label="Role"
                        name="role"
                        value={signupData.role || ''}
                        onChange={onChange}
                        options={roleOptions}
                        required
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <div className={styles.loadingSpinner}></div>
                                Registering...
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} />
                                Register User
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterUserModal;