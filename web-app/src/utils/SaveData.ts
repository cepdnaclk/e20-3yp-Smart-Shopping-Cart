import { inventoryService } from "../hooks/services/inventoryService";
import { layoutService } from "../hooks/services/layoutService";
import Fixture from "../types/Fixture";
import { Item, InventoryItem } from "../types/Item";

// Type aliases
type ItemMap = Record<string, Item[][][]>;
type FixturesMap = Record<string, Fixture>;

/**
 * Saves layout (fixtures and itemMap) to the database
 * Provides user feedback via alert
 */
export const saveLayoutData = async (itemMap: ItemMap, fixtures: FixturesMap) => {
  try {
    await layoutService.saveLayout(fixtures, itemMap);
    console.log("Layout and item map saved to database");
    alert("Layout and item map saved!");
  } catch (error) {
    console.error("Error saving layout and item map:", error);
    alert("Error saving layout and item map. Please try again.");
  }
};

/**
 * Saves inventory items to the database
 * Provides user feedback via alert
 */
export const saveInventoryData = async (inventoryItems: InventoryItem[]) => {
  try {
    await inventoryService.saveInventoryItems(inventoryItems);
    console.log("Inventory items saved to database");
    alert("Inventory items saved!");
  } catch (error) {
    console.error("Error saving inventory items:", error);
    alert("Error saving inventory items. Please try again.");
  }
};

/**
 * Clears all layout and inventory data from the backend
 * Then reloads the page
 */
export const clearLayoutData = async () => {
  try {
    await layoutService.clearLayout();
    console.log("Store data cleared from database");
    alert("Store data cleared!");
    window.location.href = window.location.href;
  } catch (error) {
    console.error("Error clearing store data:", error);
    alert("Error clearing store data. Please try again.");
  }
};
