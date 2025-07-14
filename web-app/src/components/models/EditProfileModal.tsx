import React from 'react';
import { X, Save, User } from 'lucide-react';
import FormField from '../form_fields/FormField';
import styles from './EditProfileModal.module.css'; // Import the CSS Module

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

    const formFields = [
        { name: 'firstName', label: 'First Name', type: 'text', required: true },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true },
        { name: 'nic', label: 'NIC', type: 'text', required: true },
    ];

    return (
        <div className={styles.modalOverlay} onClick={onCancel}>
            <div className={`${styles.modalContent} scrollable-area`} onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onCancel}
                    className={styles.closeButton}
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                <div className={styles.header}>
                    <div className={styles.iconContainer}>
                        <User size={24} color="#2563eb" />
                    </div>
                    <div>
                        <h2 className={styles.title}>Edit Profile</h2>
                        <p className={styles.subtitle}>Update your personal information</p>
                    </div>
                </div>

                <div className={styles.formGrid}>
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

                <div className={styles.buttonContainer}>
                    <button
                        onClick={onCancel}
                        className={styles.cancelButton}
                    >
                        <X size={16} />
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        disabled={loading}
                        className={`${styles.saveButton} ${loading ? styles.loading : ''}`}
                    >
                        {loading ? (
                            <>
                                <div className={styles.loadingSpinner}></div>
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
    );
};

export default EditProfileModal;