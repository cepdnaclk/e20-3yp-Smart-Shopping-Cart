import api from "./api";

// Assuming these types are defined elsewhere and imported correctly
import Fixture from "../../types/Fixture";
import { Item } from "../../types/Item";

// Corrected type aliases for clarity within the service file
type ItemMapService = Record<string, Item[][][]>;
type FixturesMapService = Record<string, Fixture>;

export const layoutService = {
    /**
     * Persists the fixture layout and item mapping data to the backend.
     * Requires authentication.
     * @param fixtureLayout - Object representing the layout structure of fixtures
     * @param itemMap - Object mapping item IDs to layout positions or metadata
     * @returns A promise that resolves to the response data from the save layout API call.
     * @throws Error if authentication tokens are missing or the API call fails.
     */
    async saveLayout(fixtureLayout: FixturesMapService, itemMap: ItemMapService): Promise<any> {
        // Check for tokens before making request
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (!accessToken || !refreshToken) {
            throw new Error('Authentication tokens missing. Please log in again.');
        }

        const response = await api.post("/layout/auth/save", { fixtureLayout, itemMap });
        return response.data;
    },

    /**
     * Retrieves the saved fixture layout and item mapping from the backend for a specific store.
     * Requires authentication.
     * @param storeName - The name of the store for which to retrieve the layout.
     * @returns A promise that resolves to an object containing the layout data and item mappings.
     * @throws Error if authentication tokens are missing or the API call fails.
     */

    /**
     * IMPORTANT: There was no data about the supermarker/stroe name in the backend.
     * I need the store name or some identifier to fetch the correct layout to the mobile app
     */
    async getLayout(storeName: string): Promise<{ fixtureLayout: FixturesMapService, itemMap: ItemMapService }> {
        // Check for tokens before making request
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (!accessToken || !refreshToken) {
            throw new Error('Authentication tokens missing. Please log in again.');
        }

        // Construct the URL with a query parameter for storeName
        const response = await api.get<{ fixtureLayout: FixturesMapService, itemMap: ItemMapService }>(`/layout/auth/get?storeName=${encodeURIComponent(storeName)}`);
        return response.data;
    },

    /**
     * Deletes the saved layout and item mapping data from the backend.
     * Requires authentication.
     * @returns A promise that resolves to the success message from the API.
     * @throws Error if authentication tokens are missing or the API call fails.
     */
    async clearLayout(): Promise<string> {
        // Check for tokens before making request
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (!accessToken || !refreshToken) {
            throw new Error('Authentication tokens missing. Please log in again.');
        }

        const response = await api.delete("/layout/auth/clear");
        return response.data.message || 'Layout cleared successfully.';
    },
};