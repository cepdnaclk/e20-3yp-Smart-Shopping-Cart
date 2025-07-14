import React from 'react';
import { Edit, Trash2, User, RefreshCw } from 'lucide-react';
import { useProfileManagement } from '../../hooks/UI/useUserProfile';
import ConfirmationModal from '../models/ConfirmationModal';
import EditProfileModal from '../models/EditProfileModal';
import styles from './UserProfile.module.css';

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
    setShowConfirmModal,
  } = useProfileManagement();

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
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.iconContainer}>
            <User size={24} color="#2563eb" />
          </div>
          <div>
            <h3 className={styles.title}>My Profile</h3>
            <p className={styles.subtitle}>Manage your personal information</p>
          </div>
        </div>
        <button
          onClick={handleFetchProfile}
          disabled={loading}
          className={`${styles.viewProfileButton} ${loading ? styles.disabledButton : ''}`}
        >
          {loading ? (
            <>
              {/* You can remove the span below if you're removing the animation */}
              <span className={styles.loadingSpinner}></span>
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
          <div className={styles.profileGrid}>
            {profileFields.map((field) => (
              <div key={field.key} className={styles.profileCard}>
                <div className={styles.profileLabel}>{field.label}</div>
                <div className={styles.profileValue}>
                  {(profile as any)[field.key] || 'Not specified'}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.actionButtonsContainer}>
            <button
              onClick={() => setEditMode(true)}
              className={styles.editButton}
            >
              <Edit size={16} />
              Edit Profile
            </button>
            {profile.role !== 'ADMIN' && (
              <button
                onClick={handleDeleteAccount}
                className={styles.deleteButton}
              >
                <Trash2 size={16} />
                Delete Account
              </button>
            )}
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>No Profile Data</div>
          <div className={styles.emptyStateDescription}>
            Click "Refresh Profile" to load your information
          </div>
        </div>
      )}

      {/* Message Box */}
      {message && (
        <div
          className={`${styles.messageBox} ${
            message.includes('successful') || message.includes('updated') || message.includes('deleted')
              ? styles.successMessage
              : styles.errorMessage
          }`}
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
  );
};
