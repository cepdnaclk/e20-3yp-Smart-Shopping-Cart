import Fixture from "../types/Fixture";
import Item from "../types/Item";

/**
 * Data loading utilities for retrieving persisted application state
 * Handles localStorage errors gracefully with fallback values
 */

/**
 * Loads the item mapping from localStorage
 * @returns Parsed item map or empty object if not found/corrupted
 */
export const loadItemMap = () => {
  try {
    const savedItemMap = localStorage.getItem("item_map");
    if (savedItemMap) {
      const parsedItemMap: Record<string, Item[][][]> =
        JSON.parse(savedItemMap);
      return parsedItemMap;
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error loading item map:", error);
    const defaultShelves = {};
    return defaultShelves;
  }
};

/**
 * Loads the fixture layout from localStorage
 * @returns Parsed fixture map or empty object if not found/corrupted
 */
export const loadStoreLayout = () => {
  try {
    const savedLayout = localStorage.getItem("store_layout");
    if (savedLayout) {
      const parsedLayout: Record<string, Fixture> = JSON.parse(savedLayout);
      return parsedLayout;
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error loading store layout:", error);
    return {};
  }
};
