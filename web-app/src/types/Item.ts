/**
 * Item represents a product placed in the Item Map
 * Includes position metadata for grid system
 */

export type Item = {
  id: string; // Unique ID of the item
  name: string; // Name of the item
  row: number; // Row index in the grid (0-based)
  col: number; // Column index in the grid (0-based)
  index: number; // Index within a cell (0-based) which defines the order of items from left to right
};

export type InventoryItem = {
  _id: string;
  name: string;
  imageUrl: string;
  count: number;
}

export type ItemProps = {
    id: string;
    name: string;
    imageUrl: string;
    count: number;
    removeItem: (id: string) => void;
    updateItemCount: (id: string, newCount: number) => void;
    incrementCount: (id: string) => void;
    decrementCount: (id: string) => void;
}

export type ItemContainerProps = {
  rows?: number;
  cols?: number;
  edge: string;
}