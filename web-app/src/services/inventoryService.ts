/**
 * inventoryService - Provides functions to fetch and persist inventory data using the API.
 * Includes methods to retrieve all inventory items and save changes to the backend.
 */

import api from "./api";

export const inventoryService = {
    /**
     * Fetches the list of inventory items from the backend.
     * Logs the retrieved data to the console for debugging.
     * @returns Array of inventory item objects from the server
     */
    async getInventoryItems() {
        const response = await api.get("/inventory");
        console.log("Fetched inventory items:", response.data);
        return response.data;
    },

    /**
     * Sends updated or new inventory items to the backend for persistence.
     * @param inventoryItems - Array or object containing inventory data to be saved
     * @returns Response data from the server after saving
     */
    async saveInventoryItems(inventoryItems: any) {
        const response = await api.post("/inventory", { inventoryItems });
        return response.data;
    },
};
