import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import styles from './ConfirmationModal.module.css'; // Import the CSS Module

interface ConfirmationModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isDestructive = false
}) => {
    if (!isOpen) return null;

    // Conditionally apply classes based on isDestructive prop
    const iconContainerClasses = `${styles.iconContainer} ${isDestructive ? styles.destructiveIconContainer : ''}`;
    const confirmButtonClasses = `${styles.confirmButton} ${isDestructive ? styles.destructiveConfirmButton : ''}`;

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

                <div className={iconContainerClasses}>
                    <AlertTriangle
                        size={24}
                        color={isDestructive ? '#dc2626' : '#2563eb'}
                    />
                </div>

                <h3 className={styles.modalTitle}>{title}</h3>
                <p className={styles.modalMessage}>{message}</p>

                <div className={styles.buttonContainer}>
                    <button
                        onClick={onCancel}
                        className={styles.cancelButton}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={confirmButtonClasses}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;