import React from 'react';
import { X, Save, User } from 'lucide-react';
import FormField from '../form_fields/FormField';

interface EditProfileModalProps {
    isOpen: boolean;
    editForm: any;
    loading: boolean;
    onSave: () => void;
    onCancel: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    editForm,
    loading,
    onSave,
    onCancel,
    onChange
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
            maxWidth: '40rem',
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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '24px',
            borderTop: '1px solid #f1f5f9',
        },
        cancelButton: {
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            color: '#475569',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        saveButton: {
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: loading ? 0.7 : 1,
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
        { name: 'firstName', label: 'First Name', type: 'text', required: true },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true },
        { name: 'nic', label: 'NIC', type: 'text', required: true },
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
            <div style={styles.modalOverlay} onClick={onCancel}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={onCancel} 
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
                            <User size={24} color="#2563eb" />
                        </div>
                        <div>
                            <h2 style={styles.title}>Edit Profile</h2>
                            <p style={styles.subtitle}>Update your personal information</p>
                        </div>
                    </div>
                    
                    <div style={styles.form}>
                        {formFields.map((field) => (
                            <FormField
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                value={editForm[field.name] || ''}
                                onChange={onChange}
                                required={field.required}
                                placeholder={`Enter your ${field.label.toLowerCase()}`}
                            />
                        ))}
                    </div>
                    
                    <div style={styles.buttonContainer}>
                        <button 
                            onClick={onCancel} 
                            style={styles.cancelButton}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f1f5f9';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            <X size={16} />
                            Cancel
                        </button>
                        <button 
                            onClick={onSave}
                            disabled={loading}
                            style={styles.saveButton}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.backgroundColor = '#2563eb';
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={styles.loadingSpinner}></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfileModal;