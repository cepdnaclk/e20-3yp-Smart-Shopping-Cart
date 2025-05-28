import Fixture from "../types/Fixture";
import Item from "../types/Item";

// These types represent the actual values (not wrapped in an object)
type ItemMap = Record<string, Item[][][]>;
type FixturesMap = Record<string, Fixture>;

// Accept direct value instead of destructured object
export const saveItemMap = (itemMap: ItemMap, fixtures: FixturesMap) => {
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

export const saveStoreLayout = (fixtures: FixturesMap) => {
  try {
    localStorage.setItem("store_layout", JSON.stringify(fixtures));
    console.log("Store Layout saved:", JSON.stringify(fixtures));
    alert("Store Layout saved!");
  } catch (error) {
    console.error("Error saving store layout:", error);
  }
};

export const clearStoreData = () => {
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

