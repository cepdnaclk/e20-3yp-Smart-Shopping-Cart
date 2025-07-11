import React from 'react';
import { Edit, Trash2, User, RefreshCw } from 'lucide-react';
import { useProfileManagement } from '../../hooks/UI/useUserProfile';
import ConfirmationModal from '../models/ConfirmationModal';
import EditProfileModal from '../models/EditProfileModal';

export const UserProfile: React.FC = () => {
    const {
        profile,
        editMode,
        setEditMode,
        editForm,
        loading,
        message,
        showConfirmModal,
        handleFetchProfile,
        handleEditChange,
        handleUpdateProfile,
        handleDeleteAccount,
        confirmDeleteAccount,
        handleCancelEdit,
        setShowConfirmModal
    } = useProfileManagement();

    const styles = {
        container: {
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            fontFamily: 'Inter, system-ui, sans-serif',
            border: '1px solid #f1f5f9',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '1px solid #f1f5f9',
        },
        titleContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
        },
        iconContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#eff6ff',
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
        viewProfileButton: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            color: '#475569',
            gap: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.2s ease',
        },
        profileGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
        },
        profileCard: {
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            transition: 'all 0.2s ease',
        },
        profileLabel: {
            fontSize: '12px',
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase' as 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
        },
        profileValue: {
            fontSize: '16px',
            fontWeight: 500,
            color: '#1e293b',
            wordBreak: 'break-word' as 'break-word',
        },
        actionButtonsContainer: {
            display: 'flex',
            gap: '12px',
            paddingTop: '24px',
            borderTop: '1px solid #f1f5f9',
        },
        editButton: {
            display: 'flex',
            alignItems: 'center',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '8px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        },
        deleteButton: {
            display: 'flex',
            alignItems: 'center',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '8px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        },
        messageBox: {
            marginTop: '24px',
            padding: '16px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
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
        emptyState: {
            textAlign: 'center' as 'center',
            padding: '48px 24px',
            color: '#64748b',
        },
        emptyStateTitle: {
            fontSize: '18px',
            fontWeight: 600,
            color: '#475569',
            marginBottom: '8px',
        },
        emptyStateDescription: {
            fontSize: '14px',
            color: '#64748b',
        },
        loadingSpinner: {
            width: '16px',
            height: '16px',
            border: '2px solid #e2e8f0',
            borderTop: '2px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
        },
    };

    const profileFields = [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'phoneNumber', label: 'Phone Number' },
        { key: 'nic', label: 'NIC' },
        { key: 'role', label: 'Role' },
        { key: 'username', label: 'Username' },
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
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.titleContainer}>
                        <div style={styles.iconContainer}>
                            <User size={24} color="#2563eb" />
                        </div>
                        <div>
                            <h3 style={styles.title}>My Profile</h3>
                            <p style={styles.subtitle}>Manage your personal information</p>
                        </div>
                    </div>
                    <button
                        onClick={handleFetchProfile}
                        disabled={loading}
                        style={styles.viewProfileButton}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }
                        }}
                    >
                        {loading ? (
                            <>
                                <div style={styles.loadingSpinner}></div>
                                Loading...
                            </>
                        ) : (
                            <>
                                <RefreshCw size={16} />
                                Refresh Profile
                            </>
                        )}
                    </button>
                </div>

                {/* Profile Content */}
                {profile ? (
                    <>
                        <div style={styles.profileGrid}>
                            {profileFields.map((field) => (
                                <div
                                    key={field.key}
                                    style={styles.profileCard}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                                        e.currentTarget.style.borderColor = '#cbd5e1';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f8fafc';
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                    }}
                                >
                                    <div style={styles.profileLabel}>
                                        {field.label}
                                    </div>
                                    <div style={styles.profileValue}>
                                        {(profile as any)[field.key] || 'Not specified'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={styles.actionButtonsContainer}>
                            <button
                                onClick={() => setEditMode(true)}
                                style={styles.editButton}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#2563eb';
                                }}
                            >
                                <Edit size={16} />
                                Edit Profile
                            </button>
                            {profile.role !== 'ADMIN' && (
                                <button
                                    onClick={handleDeleteAccount}
                                    style={styles.deleteButton}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#b91c1c';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#dc2626';
                                    }}
                                >
                                    <Trash2 size={16} />
                                    Delete Account
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyStateTitle}>No Profile Data</div>
                        <div style={styles.emptyStateDescription}>
                            Click "Refresh Profile" to load your information
                        </div>
                    </div>
                )}

                {/* Message Box */}
                {message && (
                    <div
                        style={{
                            ...styles.messageBox,
                            ...(message.includes('successful') || message.includes('updated') || message.includes('deleted')
                                ? styles.successMessage
                                : styles.errorMessage),
                        }}
                    >
                        {message}
                    </div>
                )}

                {/* Edit Profile Modal */}
                <EditProfileModal
                    isOpen={editMode}
                    editForm={editForm}
                    loading={loading}
                    onSave={handleUpdateProfile}
                    onCancel={handleCancelEdit}
                    onChange={handleEditChange}
                />

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showConfirmModal}
                    title="Delete Account"
                    message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
                    confirmText="Delete Account"
                    cancelText="Cancel"
                    onConfirm={confirmDeleteAccount}
                    onCancel={() => setShowConfirmModal(false)}
                    isDestructive={true}
                />
            </div>
        </>
    );
};