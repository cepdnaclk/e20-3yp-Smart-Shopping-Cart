import { useState, useEffect, useCallback } from 'react';
import { Profile, UserRole } from '../../types/Auth'; // Assuming Profile and UserRole are defined here
import { useAuthContext } from '../context/useAuthContext';
import { userService } from '../services/userService';
import { authService } from '../services/authService';

/**
 * useProfileManagement - Custom React hook for managing user profile data and related actions.
 * Handles fetching, updating, and deleting user profiles, along with loading and error states.
 */
export const useProfileManagement = () => {

    const {profile, setProfile} = useAuthContext(); // Assuming userService has a profile state
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editForm, setEditForm] = useState<Profile>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    // Effect to fetch profile data on component mount
    useEffect(() => {
        handleFetchProfile();
    }, [profile?.role]); // Dependency on getCurrentUserRole to re-fetch if user role changes (e.g., after login/logout)

    /**
     * Fetches the current user's profile data from the backend.
     */
    const handleFetchProfile = useCallback(async (): Promise<void> => {
        setLoading(true);
        setMessage('');
        try {
            const response = await userService.getProfile();
            // Explicitly cast the role property to UserRole when setting state
            const typedProfile: Profile = {
                ...response,
                role: response.role as UserRole, 
                username: profile?.username 
            };
            setProfile(typedProfile);
            setEditForm(typedProfile); // Initialize edit form with fetched data
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Network error';
            setMessage('Error fetching profile: ' + errorMessage);
            setProfile(null); // Clear profile on error
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Handles changes in the edit profile form fields.
     * @param e - React change event from an input element.
     */
    const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    /**
     * Submits the updated profile data to the backend.
     */
    const handleUpdateProfile = useCallback(async (): Promise<void> => {
        setLoading(true);
        setMessage('');
        try {
            // Filter out undefined/null values from editForm before sending
            const updatedData = Object.fromEntries(
                Object.entries(editForm).filter(([, value]) => value !== undefined && value !== null)
            );
            await userService.updateProfile(updatedData);
            setMessage('Profile updated successfully!');
            setEditMode(false); // Exit edit mode
            await handleFetchProfile(); // Re-fetch to display updated data
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Network error';
            setMessage('Error updating profile: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    }, [editForm, handleFetchProfile]);

    /**
     * Initiates the account deletion process by showing a confirmation modal.
     * Prevents deletion for ADMIN roles.
     */
    const handleDeleteAccount = useCallback(() => {
        if (profile?.role === 'ADMIN') {
            setMessage('ADMIN account cannot be deleted.');
            return;
        }
        setShowConfirmModal(true);
    }, [profile?.role]);

    /**
     * Confirms and executes the account deletion.
     */
    const confirmDeleteAccount = useCallback(async (): Promise<void> => {
        setShowConfirmModal(false); // Close modal immediately
        setLoading(true);
        setMessage('');
        try {
            // For deletion, we use the username from the fetched profile, not the one from useAuth
            const usernameToDelete = profile?.username;
            if (!usernameToDelete) {
                setMessage('Cannot delete account: Username not found.');
                setLoading(false);
                return;
            }
            await userService.deleteAccount(usernameToDelete);
            setMessage('Account deleted. Logging out...');
            // Log out after a short delay to allow message to be seen
            setTimeout(() => authService.logout(), 1500);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Network error';
            setMessage('Error deleting account: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    }, [profile]); // Dependency on profile to get usernameToDelete

    /**
     * Cancels the edit mode, resetting the form data to the current profile.
     */
    const handleCancelEdit = useCallback(() => {
        setEditMode(false);
        setEditForm(profile || {}); // Reset edit form to current profile data
        setMessage(''); // Clear any messages
    }, [profile]);

    return {
        profile,
        editMode,setEditMode,
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
        setShowConfirmModal // Expose for modal control
    };
};
