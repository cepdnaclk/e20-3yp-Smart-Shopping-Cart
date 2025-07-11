import React from 'react';
import { X, UserPlus, User } from 'lucide-react';
import { UserRole } from '../../types/Auth';
import FormField from '../form_fields/FormField';
import SelectField from '../form_fields/SelectField';

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

    const styles = {
        modalOverlay: {
            position: 'fixed' as 'fixed',
            inset: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
        },
        modalContent: {
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '32rem',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto' as 'auto',
            fontFamily: 'Inter, system-ui, sans-serif',
            position: 'relative' as 'relative',
            border: '1px solid #f1f5f9',
        },
        closeButton: {
            position: 'absolute' as 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            color: '#64748b',
            transition: 'all 0.2s ease',
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px',
            paddingRight: '48px',
        },
        iconContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#eff6ff',
            marginRight: '16px',
        },
        title: {
            fontSize: '24px',
            fontWeight: 600,
            color: '#1e293b',
            margin: 0,
        },
        subtitle: {
            fontSize: '14px',
            color: '#64748b',
            marginTop: '4px',
        },
        form: {
            display: 'flex',
            flexDirection: 'column' as 'column',
            gap: '20px',
        },
        submitButton: {
            width: '100%',
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: isLoading ? 0.7 : 1,
        },
        messageBox: {
            padding: '16px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        successMessage: {
            backgroundColor: '#dcfce7',
            color: '#166534',
            border: '1px solid #bbf7d0',
        },
        errorMessage: {
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
        },
        loadingSpinner: {
            width: '16px',
            height: '16px',
            border: '2px solid #ffffff40',
            borderTop: '2px solid #ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
        },
    };

    const formFields = [
        { name: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'Enter first name' },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Enter last name' },
        { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter email address' },
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true, placeholder: 'Enter phone number' },
        { name: 'nic', label: 'NIC', type: 'text', required: true, placeholder: 'Enter NIC number' },
    ];

    return (
        <>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div style={styles.modalOverlay} onClick={onClose}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={onClose} 
                        style={styles.closeButton}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                            e.currentTarget.style.color = '#334155';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#64748b';
                        }}
                    >
                        <X size={20} />
                    </button>
                    
                    <div style={styles.header}>
                        <div style={styles.iconContainer}>
                            <UserPlus size={24} color="#2563eb" />
                        </div>
                        <div>
                            <h2 style={styles.title}>Register New User</h2>
                            <p style={styles.subtitle}>Create a new user account</p>
                        </div>
                    </div>

                    {/* Success/Error Messages */}
                    {success && (
                        <div style={{ ...styles.messageBox, ...styles.successMessage }}>
                            <div style={{ 
                                width: '16px', 
                                height: '16px', 
                                borderRadius: '50%', 
                                backgroundColor: '#22c55e', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                            }}>
                                <span style={{ fontSize: '10px', color: 'white' }}>✓</span>
                            </div>
                            {success}
                        </div>
                    )}

                    {error && (
                        <div style={{ ...styles.messageBox, ...styles.errorMessage }}>
                            <div style={{ 
                                width: '16px', 
                                height: '16px', 
                                borderRadius: '50%', 
                                backgroundColor: '#ef4444', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                            }}>
                                <span style={{ fontSize: '10px', color: 'white' }}>!</span>
                            </div>
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={onSubmit} style={styles.form}>
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
                            style={styles.submitButton}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.backgroundColor = '#2563eb';
                                }
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <div style={styles.loadingSpinner}></div>
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
        </>
    );
};

export default RegisterUserModal;