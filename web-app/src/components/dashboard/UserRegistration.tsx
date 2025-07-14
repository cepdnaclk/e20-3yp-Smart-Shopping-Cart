import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Users, Info } from 'lucide-react';
import { UserRole } from '../../types/Auth';
import { useAuthForm } from '../../hooks/UI/useAuthForm';
import RegisterUserModal from '../models/RegisterUserModal';
import { useAuthContext } from '../../hooks/context/useAuthContext';
import styles from './UserRegistration.module.css';

export const UserRegistration: React.FC = () => {
    const { profile } = useAuthContext();
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    const {
        signupData,
        handleSignupChange,
        handleSignupSubmit,
        isLoading,
        error,
        success,
    } = useAuthForm();

    const roleDescriptions: Record<UserRole, string> = {
        ADMIN: 'Full access. Can register any user, manage all users, and view all data.',
        MANAGER: 'Can register CASHIER, STAFF, SECURITY, SUPPLIER. Can manage users in these roles.',
        CASHIER: 'Can view and update own profile. Limited access to billing and cart.',
        STAFF: 'Can view and update own profile. Limited access to assigned tasks.',
        SECURITY: 'Can view and update own profile. Limited access to security logs.',
        SUPPLIER: 'Can view and update own profile. Access to supply-related features.'
    };

    const getRegistrableRoles = (): UserRole[] => {
        if (!profile) return [];
        return profile.role === 'ADMIN'
            ? ['MANAGER', 'CASHIER', 'STAFF', 'SECURITY', 'SUPPLIER']
            : profile.role === 'MANAGER'
            ? ['CASHIER', 'STAFF', 'SECURITY', 'SUPPLIER']
            : [];
    };

    const registrableRoles = getRegistrableRoles();
    const roleOptions = registrableRoles.map(role => ({ value: role, label: role }));

    const [localMessage, setLocalMessage] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        if (success) {
            setLocalMessage(success);
            setLocalError(null);
            setShowRegisterForm(false);
        } else if (error) {
            setLocalError(error);
            setLocalMessage(null);
        }
    }, [success, error]);

    const handleCloseModal = () => {
        setShowRegisterForm(false);
        setLocalMessage(null);
        setLocalError(null);
    };

    const handleOpenModal = () => {
        setShowRegisterForm(true);
        setLocalMessage(null);
        setLocalError(null);
    };

    if (!profile) return null;

    const canRegisterUsers = profile.role === 'ADMIN' || profile.role === 'MANAGER';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.iconContainer}>
                    <Shield size={24} color="#2563eb" />
                </div>
                <div>
                    <h3 className={styles.title}>{profile?.role} Dashboard</h3>
                    <p className={styles.subtitle}>Role management and user actions</p>
                </div>
            </div>

            <div className={styles.roleInfo}>
                <div className={styles.roleTitle}>
                    <Info size={16} color="#2563eb" />
                    Your Role Permissions
                </div>
                <div className={styles.roleDescription}>
                    {roleDescriptions[profile.role as UserRole]}
                </div>
            </div>

            {localMessage && (
                <div className={`${styles.messageBox} ${styles.successMessage}`}>
                    <div className={styles.successIcon}>✓</div>
                    {localMessage}
                </div>
            )}

            {localError && (
                <div className={`${styles.messageBox} ${styles.errorMessage}`}>
                    <div className={styles.errorIcon}>!</div>
                    {localError}
                </div>
            )}

            <div className={styles.actionsContainer}>
                {canRegisterUsers && (
                    <button
                        onClick={handleOpenModal}
                        className={styles.registerButton}
                    >
                        <UserPlus size={16} />
                        Register New User
                    </button>
                )}

                {canRegisterUsers && (
                    <div>
                        <h4 className={styles.permissionsTitle}>
                            <Users size={16} color="#2563eb" />
                            Available Roles to Register
                        </h4>
                        <div className={styles.permissionsGrid}>
                            {registrableRoles.map((role) => (
                                <div key={role} className={styles.permissionCard}>
                                    <div className={styles.permissionTitle}>{role}</div>
                                    <div className={styles.permissionDescription}>
                                        {roleDescriptions[role]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!canRegisterUsers && (
                    <div className={styles.noPermissions}>
                        <Users size={32} color="#94a3b8" className={styles.noPermissionIcon} />
                        <div>You don't have permission to register new users.</div>
                        <div className={styles.noPermissionText}>
                            Contact your administrator for access.
                        </div>
                    </div>
                )}
            </div>

            <RegisterUserModal
                isOpen={showRegisterForm}
                signupData={signupData}
                isLoading={isLoading}
                error={localError}
                success={localMessage}
                roleOptions={roleOptions}
                onClose={handleCloseModal}
                onChange={handleSignupChange}
                onSubmit={handleSignupSubmit}
            />
        </div>
    );
};
