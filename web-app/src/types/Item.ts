/**
 * Item represents a product placed in the Item Map
 * Includes position metadata for grid system
 */

type Item = {
  id: string; // Unique ID of the item
  name: string; // Name of the item
  row: number; // Row index in the grid (0-based)
  col: number; // Column index in the grid (0-based)
  index: number; // Index within a cell (0-based) which defines the order of items from left to right
};

export default Item;
