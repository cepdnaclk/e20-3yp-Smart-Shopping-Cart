import Fixture from "../types/Fixture";
import Item from "../types/Item";

/**
 * Data persistence utilities for saving application state to localStorage
 * Provides both combined and individual save operations with user feedback
 */

// Type aliases for cleaner function signatures
type ItemMap = Record<string, Item[][][]>;
type FixturesMap = Record<string, Fixture>;

/**
 * Saves both item map and fixtures (layout) to localStorage
 * Provides user feedback via alert dialog
 * @param itemMap - Complete item mapping data
 * @param fixtures - Complete fixture layout data
 */
export const saveData = (itemMap: ItemMap, fixtures: FixturesMap) => {
  try {
    localStorage.setItem("item_map", JSON.stringify(itemMap));
    console.log("Item map saved:", JSON.stringify(itemMap));
    localStorage.setItem("store_layout", JSON.stringify(fixtures));
    console.log("Store Layout saved:", JSON.stringify(fixtures));
    alert("Item map saved!");
  } catch (error) {
    console.error("Error saving item map:", error);
  }
};

/**
 * Saves fixtures (layout) to localStorage
 * Provides user feedback via alert dialog
 * @param fixtures - Complete fixture layout data
 */
export const saveStoreLayout = (fixtures: FixturesMap) => {
  try {
    localStorage.setItem("store_layout", JSON.stringify(fixtures));
    console.log("Store Layout saved:", JSON.stringify(fixtures));
    alert("Store Layout saved!");
  } catch (error) {
    console.error("Error saving store layout:", error);
  }
};

/**
 * Completely clears all application data from localStorage
 * Nuclear option for resetting application state
 */
export const clearStoredData = () => {
  try {
    localStorage.removeItem("store_layout");
    localStorage.removeItem("item_map");
    localStorage.clear();
    console.log("Store data cleared.");
    alert("Store data cleared!");
  } catch (error) {
    console.error("Error clearing store data:", error);
  }
};
