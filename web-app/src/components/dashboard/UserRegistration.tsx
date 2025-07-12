import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Users, Info } from 'lucide-react';
import { UserRole } from '../../types/Auth';
import { useAuthForm } from '../../hooks/UI/useAuthForm';
import RegisterUserModal from '../models/RegisterUserModal';
import { useAuthContext } from '../../hooks/context/useAuthContext';

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
            alignItems: 'center',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '1px solid #f1f5f9',
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
        roleInfo: {
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid #e2e8f0',
        },
        roleTitle: {
            fontSize: '16px',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        roleDescription: {
            fontSize: '14px',
            color: '#64748b',
            lineHeight: '1.5',
        },
        actionsContainer: {
            display: 'flex',
            flexDirection: 'column' as 'column',
            gap: '16px',
        },
        registerButton: {
            display: 'flex',
            alignItems: 'center',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            gap: '8px',
            backgroundColor: '#2563eb',
            color: 'white',
            transition: 'all 0.2s ease',
            width: 'fit-content',
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
        permissionsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginTop: '24px',
        },
        permissionCard: {
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #e2e8f0',
        },
        permissionTitle: {
            fontSize: '14px',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '4px',
        },
        permissionDescription: {
            fontSize: '12px',
            color: '#64748b',
            lineHeight: '1.4',
        },
        noPermissions: {
            textAlign: 'center' as 'center',
            padding: '24px',
            color: '#64748b',
            fontSize: '14px',
        },
    };

    if (!profile) return null;

    const canRegisterUsers = profile.role === 'ADMIN' || profile.role === 'MANAGER';

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.iconContainer}>
                    <Shield size={24} color="#2563eb" />
                </div>
                <div>
                    <h3 style={styles.title}>{profile?.role} Dashboard</h3>
                    <p style={styles.subtitle}>Role management and user actions</p>
                </div>
            </div>

            {/* Role Information */}
            <div style={styles.roleInfo}>
                <div style={styles.roleTitle}>
                    <Info size={16} color="#2563eb" />
                    Your Role Permissions
                </div>
                <div style={styles.roleDescription}>
                    {roleDescriptions[profile.role as UserRole]}
                </div>
            </div>

            {/* Success/Error Messages */}
            {localMessage && (
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
                    {localMessage}
                </div>
            )}

            {localError && (
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
                    {localError}
                </div>
            )}

            {/* Actions */}
            <div style={styles.actionsContainer}>
                {canRegisterUsers && (
                    <button
                        onClick={handleOpenModal}
                        style={styles.registerButton}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#1d4ed8';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563eb';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <UserPlus size={16} />
                        Register New User
                    </button>
                )}

                {/* Permissions Grid */}
                {canRegisterUsers && (
                    <div>
                        <h4 style={{ 
                            fontSize: '16px', 
                            fontWeight: 600, 
                            color: '#1e293b', 
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Users size={16} color="#2563eb" />
                            Available Roles to Register
                        </h4>
                        <div style={styles.permissionsGrid}>
                            {registrableRoles.map((role) => (
                                <div key={role} style={styles.permissionCard}>
                                    <div style={styles.permissionTitle}>{role}</div>
                                    <div style={styles.permissionDescription}>
                                        {roleDescriptions[role]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!canRegisterUsers && (
                    <div style={styles.noPermissions}>
                        <Users size={32} color="#94a3b8" style={{ marginBottom: '8px' }} />
                        <div>You don't have permission to register new users.</div>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>
                            Contact your administrator for access.
                        </div>
                    </div>
                )}
            </div>

            {/* Register User Modal */}
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