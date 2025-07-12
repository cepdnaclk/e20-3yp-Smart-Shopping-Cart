import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

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
            maxWidth: '28rem',
            width: '90%',
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
        iconContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: isDestructive ? '#fee2e2' : '#eff6ff',
            marginBottom: '16px',
        },
        modalTitle: {
            fontSize: '20px',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '8px',
            lineHeight: '1.4',
        },
        modalMessage: {
            fontSize: '16px',
            color: '#475569',
            marginBottom: '24px',
            lineHeight: '1.6',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px',
        },
        cancelButton: {
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            color: '#475569',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
        },
        confirmButton: {
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: isDestructive ? '#dc2626' : '#2563eb',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
        },
    };

    return (
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
                
                <div style={styles.iconContainer}>
                    <AlertTriangle 
                        size={24} 
                        color={isDestructive ? '#dc2626' : '#2563eb'} 
                    />
                </div>
                
                <h3 style={styles.modalTitle}>{title}</h3>
                <p style={styles.modalMessage}>{message}</p>
                
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
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm} 
                        style={styles.confirmButton}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDestructive ? '#b91c1c' : '#1d4ed8';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDestructive ? '#dc2626' : '#2563eb';
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;