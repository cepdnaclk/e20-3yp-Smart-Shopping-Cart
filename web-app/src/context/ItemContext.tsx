import React, { createContext, useState } from "react";
import { loadItemMap } from "../utils/LoadLocal";
import Item from "../types/Item";
import { v4 as uuidv4 } from "uuid";

/**
 * ItemContext manages the complex grid system and item placement.
 * Implements a 2D grid structure: edge → row → column → items array
 * Handles drag-and-drop operations between shelves and inventory sidebar.
 */

/**
 * Represents the state of an item being dragged
 * Tracks source location for move operations
 * @interface DraggingState
 */
interface DraggingState {
  edge: string;
  row: number;
  col: number;
  index: number;
}

/**
 * Context interface for item management operations
 * @interface ItemContextType
 */
interface ItemContextType {
  itemMap: Record<string, Item[][][]>;
  setItemMap: React.Dispatch<React.SetStateAction<Record<string, Item[][][]>>>;
  dragging: DraggingState | null;
  setDragging: React.Dispatch<React.SetStateAction<DraggingState | null>>;
  handleDragStart: (
    e: React.DragEvent,
    edge: string,
    rowIndex: number,
    colIndex: number,
    itemIndex: number
  ) => void;
  handleDropOnCell: (
    e: React.DragEvent<HTMLDivElement>,
    edge: string,
    rowIndex: number,
    colIndex: number
  ) => void;
  handleRemoveItem: (
    e: React.MouseEvent,
    edge: string,
    rowIndex: number,
    colIndex: number,
    itemIndex: number
  ) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  addRow: (edge: string) => void;
  addColumn: (edge: string, rowIndex: number) => void;
  removeRow: (edge: string, rowIndex: number) => void;
  removeColumn: (edge: string, rowIndex: number, colIndex: number) => void;
}

export const ItemContext = createContext<ItemContextType | undefined>(
  undefined
);

export const ItemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [itemMap, setItemMap] = useState<Record<string, Item[][][]>>(() => {
    const savedMap = loadItemMap();
    console.log("Initial item map loaded:", savedMap);
    return savedMap || {};
  });

  const [dragging, setDragging] = useState<DraggingState | null>(null);

  /**
   * Initiates drag operation for an existing grid item
   * Sets up drag state and data transfer for drop handling
   * @param e - Drag event
   * @param edge - Edge number of the fixture the item is dragged from
   * @param rowIndex - Row index of the cell the item dragged from
   * @param colIndex - Column index of the cell the item dragged from
   * @param itemIndex - The index (order) of the item before being dragged
   */
  const handleDragStart = (
    e: React.DragEvent,
    edge: string,
    rowIndex: number,
    colIndex: number,
    itemIndex: number
  ) => {
    console.log("Setting dragging state:", {
      edge,
      rowIndex,
      colIndex,
      itemIndex,
    });

    setDragging({ edge, row: rowIndex, col: colIndex, index: itemIndex });

    // Store source info in dataTransfer
    e.dataTransfer.setData("source", "grid");
    const draggingInfo = { edge, rowIndex, colIndex, itemIndex };
    e.dataTransfer.setData("dragging-info", JSON.stringify(draggingInfo));

    // For debugging
    console.log("Drag started with info:", draggingInfo);
  };

  /**
   * Processes item drops onto grid cells
   * Handles both new items from sidebar and existing item moves
   * Maintains proper grid structure and item indexing
   * @param e - Drag event
   * @param edge - Edge number of the fixture the item is dropped on
   * @param rowIndex - Row index of the cell the item dropped to
   * @param colIndex - Column index of the cell the item dropped to
   */
  const handleDropOnCell = (
    e: React.DragEvent<HTMLDivElement>,
    edge: string,
    rowIndex: number,
    colIndex: number
  ) => {
    e.preventDefault();
    console.log("Drop received on cell:", { edge, rowIndex, colIndex });

    // Determine drag source: sidebar (new item) or grid (existing grid item move)
    const source = e.dataTransfer.getData("source");
    const jsonData = e.dataTransfer.getData("application/json");

    console.log("Drop data sources:", {
      source,
      jsonData: jsonData ? "present" : "absent",
      draggingState: dragging,
    });

    setItemMap((prevMap) => {
      // Create a deep copy to ensure immutability
      const newMap = JSON.parse(JSON.stringify(prevMap));

      // Initialize grid structure if not present
      if (!newMap[edge]) {
        newMap[edge] = Array.from({ length: 3 }, () =>
          Array.from({ length: 1 }, () => [])
        );
      }

      // Ensure target cell exists in structure
      if (!newMap[edge][rowIndex]) {
        newMap[edge][rowIndex] = [];
      }

      if (!newMap[edge][rowIndex][colIndex]) {
        newMap[edge][rowIndex][colIndex] = [];
      }

      const targetCell = newMap[edge][rowIndex][colIndex];

      try {
        // Case 1: Adding new item from sidebar inventory
        if (jsonData && source === "sidebar") {
          console.log("Adding new item from sidebar");
          const newItem: Item = JSON.parse(jsonData);

          // Add metadata for positioning + unique ID
          const newItemWithMeta = {
            ...newItem,
            id: uuidv4(), // ← this ensures uniqueness
            row: rowIndex,
            col: colIndex,
            index: targetCell.length,
          };

          targetCell.push(newItemWithMeta);
          console.log("New item added:", newItemWithMeta);
        }

        // Case 2: Moving existing item between shelf locations
        else if (dragging !== null) {
          console.log("Moving existing item", dragging);

          // Get source cell and item
          const sourceCell =
            newMap[dragging.edge]?.[dragging.row]?.[dragging.col];

          if (!sourceCell || dragging.index >= sourceCell.length) {
            console.warn("Source cell or item not found:", dragging);
            return prevMap;
          }

          // Remove item from source cell
          const [movedItem] = sourceCell.splice(dragging.index, 1);

          // Update indices for remaining items in source cell
          sourceCell.forEach((item: Item, idx: number) => {
            item.index = idx;
          });

          // Update item with new position
          const updatedItem = {
            ...movedItem,
            row: rowIndex,
            col: colIndex,
            index: targetCell.length,
          };

          // Add to target cell
          targetCell.push(updatedItem);
          console.log("Item moved:", updatedItem);
        }

        console.log("Updated map structure:", JSON.stringify(newMap, null, 2));
        return newMap;
      } catch (error) {
        console.error("Error during drop operation:", error);
        return prevMap;
      } finally {
        // Always reset dragging state after drop operation
        setDragging(null);
      }
    });
  };

  /**
   * Processes item delete in grid cells
   * Maintains proper item indexing
   * @param e - Mouse event
   * @param edge - Edge number of the fixture the cell item is on
   * @param rowIndex - Row index of the cell item is on
   * @param colIndex - Column index of the cell item is on
   * @param itemIndex - Index (order) of the item within the cell
   */
  const handleRemoveItem = (
    e: React.MouseEvent,
    edge: string,
    rowIndex: number,
    colIndex: number,
    itemIndex: number
  ) => {
    console.log("Removing item:", { edge, rowIndex, colIndex, itemIndex });
    e.stopPropagation();

    setItemMap((prevMap) => {
      const newMap = { ...prevMap };
      const cell = newMap[edge]?.[rowIndex]?.[colIndex];

      if (!cell || itemIndex >= cell.length) {
        console.warn("Cell or item not found for deletion");
        return prevMap;
      }

      // Splice the item directly
      cell.splice(itemIndex, 1);

      // Reassign indices after deletion
      cell.forEach((item, idx) => {
        item.index = idx;
      });

      return { ...newMap };
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  /**
   * Dynamically adds a new row to the specified edge
   * Initializes with one empty column for immediate use
   * @param edge - Egde number of the fixture the row is added
   */
  const addRow = (edge: string) => {
    setItemMap((prevMap) => {
      const newMap = { ...prevMap };

      if (!newMap[edge]) {
        newMap[edge] = [];
      }

      // Add new row with one empty column
      newMap[edge].push([[]]);
      return newMap;
    });
  };

  /**
   * Dynamically adds a new column to the specified row
   * @param edge - Egde number of the fixture the column is added
   * @param rowIndex - Index of the row the column is added
   */
  const addColumn = (edge: string, rowIndex: number) => {
    setItemMap((prevMap) => {
      const newMap = { ...prevMap };

      if (!newMap[edge] || !newMap[edge][rowIndex]) {
        console.warn("Cannot add column: edge or row not found");
        return prevMap;
      }

      newMap[edge][rowIndex].push([]);
      return newMap;
    });
  };

  /**
   * Dynamically removes a row from the specified edge
   * @param edge - Egde number of the fixture the row is removed
   * @param rowIndex - Index of the row
   */
  const removeRow = (edge: string, rowIndex: number) => {
    setItemMap((prevMap) => {
      const newMap = { ...prevMap };

      if (!newMap[edge] || rowIndex < 0 || rowIndex >= newMap[edge].length) {
        console.warn("Cannot remove row: invalid index or edge missing");
        return prevMap;
      }

      newMap[edge].splice(rowIndex, 1);
      return newMap;
    });
  };

  /**
   * Dynamically removes a column from the specified row
   * @param edge - Egde number of the fixture the column is removed
   * @param rowIndex - Index of the row the column is removed
   * @param colIndex - Index of the column
   */
  const removeColumn = (edge: string, rowIndex: number, colIndex: number) => {
    setItemMap((prevMap) => {
      const newMap = { ...prevMap };

      if (
        !newMap[edge] ||
        !newMap[edge][rowIndex] ||
        colIndex < 0 ||
        colIndex >= newMap[edge][rowIndex].length
      ) {
        console.warn("Cannot remove column: invalid indices");
        return prevMap;
      }

      newMap[edge][rowIndex].splice(colIndex, 1);
      return newMap;
    });
  };

  return (
    <ItemContext.Provider
      value={{
        itemMap,
        setItemMap,
        dragging,
        setDragging,
        handleDragStart,
        handleDropOnCell,
        handleRemoveItem,
        handleDragOver,
        addRow,
        addColumn,
        removeRow,
        removeColumn,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};
