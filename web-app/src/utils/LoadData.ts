import { layoutService } from "../hooks/services/layoutService";

/**
 * Data loading utilities for retrieving persisted application state from database
 * Handles API errors gracefully with fallback values
 */

/**
 * Loads the item mapping from localStorage
 * @returns Parsed item map or empty object if not found/corrupted
 */
export const loadItemMap: (storeName: string) => Promise<any> = async (storeName) => {
  try {
    const layout = await layoutService.getLayout(storeName);
    return layout?.itemMap || {};
  } catch (error) {
    console.error("Error loading item map:", error);
    return {};
  }
};

/**
 * Loads the fixture layout from localStorage
 * @returns Parsed fixture map or empty object if not found/corrupted
 */
export const loadFixtureLayout: (storeName: string) => Promise<any> = async (storeName) => {
  try {
    const layout = await layoutService.getLayout(storeName);
    return layout?.fixtureLayout || {};
  } catch (error) {
    console.error("Error loading store layout:", error);
    return {};
  }
};