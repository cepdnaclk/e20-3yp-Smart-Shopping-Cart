import React, { createContext, useState, useEffect } from "react";
import { loadItemMap } from "../utils/LoadLocal";
import Item from "../types/Item";
import { v4 as uuidv4 } from "uuid";

interface DraggingState {
  edge: string;
  row: number;
  col: number;
  index: number;
}

interface ItemContextProps {
  itemMap: Record<string, Item[][][]>;
  setItemMap: React.Dispatch<React.SetStateAction<Record<string, Item[][][]>>>;
  dragging: DraggingState | null;
  setDragging: React.Dispatch<React.SetStateAction<DraggingState | null>>;
  handleDragStart: (
    edge: string,
    rowIndex: number,
    colIndex: number,
    itemIndex: number,
    event: React.DragEvent
  ) => void;
  handleDropOnCell: (
    event: React.DragEvent<HTMLDivElement>,
    edge: string,
    rowIndex: number,
    colIndex: number
  ) => void;
  handleRemoveItem: (
    edge: string,
    rowIndex: number,
    colIndex: number,
    itemIndex: number,
    e: React.MouseEvent
  ) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  addRow: (edge: string) => void;
  addColumn: (edge: string, rowIndex: number) => void;
  removeRow: (edge: string, rowIndex: number) => void;
  removeColumn: (edge: string, rowIndex: number, colIndex: number) => void;
}

export const ItemContext = createContext<ItemContextProps | undefined>(
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

  // Save to localStorage whenever itemMap changes
  useEffect(() => {
    console.log("Item map updated:", itemMap);
    // You could add localStorage saving logic here if needed
  }, [itemMap]);

  const handleDragStart = (
    edge: string,
    rowIndex: number,
    colIndex: number,
    itemIndex: number,
    event: React.DragEvent
  ) => {
    console.log("Setting dragging state:", {
      edge,
      rowIndex,
      colIndex,
      itemIndex,
    });
    setDragging({ edge, row: rowIndex, col: colIndex, index: itemIndex });

    // Store source info in dataTransfer
    event.dataTransfer.setData("source", "grid");
    const draggingInfo = { edge, rowIndex, colIndex, itemIndex };
    event.dataTransfer.setData("dragging-info", JSON.stringify(draggingInfo));

    // For debugging
    console.log("Drag started with info:", draggingInfo);
  };

  const handleDropOnCell = (
    event: React.DragEvent<HTMLDivElement>,
    edge: string,
    rowIndex: number,
    colIndex: number
  ) => {
    event.preventDefault();
    console.log("Drop received on cell:", { edge, rowIndex, colIndex });

    // Check data transfer sources
    const source = event.dataTransfer.getData("source");
    const jsonData = event.dataTransfer.getData("application/json");

    console.log("Drop data sources:", {
      source,
      jsonData: jsonData ? "present" : "absent",
      draggingState: dragging,
    });

    setItemMap((prevMap) => {
      // Create a deep copy to ensure immutability
      const newMap = JSON.parse(JSON.stringify(prevMap));

      // Initialize shelf structure if not present
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
        // Case 1: Item from sidebar (new item)
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

        // Case 2: Moving existing item
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

  const handleRemoveItem = (
    edge: string,
    rowIndex: number,
    colIndex: number,
    itemIndex: number,
    e: React.MouseEvent
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
