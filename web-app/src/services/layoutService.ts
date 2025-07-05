/**
 * layoutService - Provides API methods for saving, retrieving, and clearing fixture layouts.
 * Handles layout data and associated item mappings for the application.
 */

import api from "./api";

export const layoutService = {
    /**
     * Persists the fixture layout and item mapping data to the backend.
     * @param fixtureLayout - Object representing the layout structure of fixtures
     * @param itemMap - Object mapping item IDs to layout positions or metadata
     * @returns Response data from the save layout API call
     */
    async saveLayout(fixtureLayout: any, itemMap: any) {
        const response = await api.post("/layouts", { fixtureLayout, itemMap });
        return response.data;
    },

    /**
     * Retrieves the saved fixture layout and item mapping from the backend.
     * @returns Layout data and item mappings as stored on the server
     */
    async getLayout() {
        const response = await api.get("/layouts");
        return response.data;
    },

    /**
     * Deletes the saved layout and item mapping data from the backend.
     * @returns Response from the API confirming deletion
     */
    async clearLayout() {
        const response = await api.delete("/layouts");
        return response.data;
    },
};
