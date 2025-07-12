import { Profile } from "../../types/Auth";
import api from "./api";

export const userService = {
    /**
     * Fetches the current user's profile data from the backend.
     * Maps to GET /user/profile/get.
     * Requires a valid access token in the Authorization header.
     * @returns A promise that resolves to the user's profile data.
     * @throws Error if the API call fails.
     */
    async getProfile(): Promise<Profile> {
        const response = await api.get<Profile>('/user/profile/get');
        return response.data;
    },

    /**
     * Updates the current user's profile data on the backend.
     * Maps to PUT /user/profile/update.
     * Requires a valid access token in the Authorization header.
     * @param profileData - The partial profile data to update.
     * @returns A promise that resolves to the updated profile data.
     * @throws Error if the API call fails.
     */
    async updateProfile(profileData: Profile): Promise<Profile> {
        const response = await api.put<Profile>('/user/profile/update', profileData);
        return response.data;
    },

    /**
     * Deletes a specified user's account.
     * Maps to DELETE /user/profile/delete?username=USERNAME.
     * The user can only delete themselves, except for ADMINs who can delete other users.
     * Requires a valid access token in the Authorization header.
     * @param username - The username of the account to delete. Optional for self-deletion if backend infers from token.
     * @returns A promise that resolves when the account is successfully deleted.
     * @throws Error if the API call fails.
     */
    async deleteAccount(username?: string): Promise<void> {
        // If username is provided, it will be added as a query parameter.
        // This handles both self-deletion (username not provided, backend infers from token)
        // and admin-initiated deletion (username provided).
        const config = username ? { params: { username } } : {};
        await api.delete(`/user/profile/delete`, config);
    },

    /**
     * Validates the current user's access token by calling the backend endpoint.
     * Maps to GET /user/profile/validate.
     * Requires a valid access token in the Authorization header.
     * @returns Promise resolving to API response (200 OK if valid, 401 if invalid)
     */
    async validateToken() {
        return api.get("/user/profile/validate");
    },

    /**
     * Retrieves the role of the current user from the backend.
     * Maps to GET /user/profile/role.
     * Requires a valid access token in the Authorization header.
     * @returns Promise resolving to an object containing the user's role
     */
    async getUserRole(): Promise<{ role: string }> {
        const response = await api.get("/user/profile/role");
        return response.data;
    },
};
