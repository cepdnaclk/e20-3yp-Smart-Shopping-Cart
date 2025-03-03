import React, { createContext, useState } from "react";

interface DraggingState {
  shelf: number;
  row: number;
  index: number;
}

interface ItemContextProps {
  itemsPerShelf: Record<string, string[][][]>;
  setItemsPerShelf: React.Dispatch<React.SetStateAction<Record<string, string[][][]>>>;
  dragging: DraggingState | null;
  setDragging: React.Dispatch<React.SetStateAction<DraggingState | null>>;
  handleDragStart: (shelfIndex: number, rowIndex: number, itemIndex: number) => void;
  handleDropOnRow: (event: React.DragEvent, selectedSide: string, targetShelf: number, targetRow: number) => void;
  addRow: (selectedSide: string, shelfIndex: number) => void;
  removeRow: (selectedSide: string, shelfIndex: number, rowIndex: number) => void;
  saveConfiguration: () => void;
}

export const ItemContext = createContext<ItemContextProps | undefined>(undefined);

export const ItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [itemsPerShelf, setItemsPerShelf] = useState<Record<string, string[][][]>>(() => {
    try {
      const savedData = localStorage.getItem("shelfConfiguration");
      return savedData ? JSON.parse(savedData) : defaultShelves;
    } catch (error) {
      console.error("Error loading data:", error);
      return defaultShelves;
    }
  });

  const [dragging, setDragging] = useState<DraggingState | null>(null);

  const handleDragStart = (shelfIndex: number, rowIndex: number, itemIndex: number) => {
    setDragging({ shelf: shelfIndex, row: rowIndex, index: itemIndex });
  };

  const handleDropOnRow = (
    event: React.DragEvent,
    selectedSide: string,
    targetShelf: number,
    targetRow: number
  ) => {
    event.preventDefault();
    const draggedItem = event.dataTransfer.getData("text/plain"); // Get item from sidebar
  
    setItemsPerShelf((prevItems) => {
      const updatedShelves = { ...prevItems };
      updatedShelves[selectedSide] = updatedShelves[selectedSide].map((shelf) =>
        shelf.map((row) => [...row])
      );
  
      // If an item is dragged from the sidebar
      if (draggedItem) {
        updatedShelves[selectedSide][targetShelf][targetRow].push(draggedItem);
      }
      // If an item is moved within shelves
      else if (dragging) {
        const sourceRow =
          updatedShelves[selectedSide][dragging.shelf][dragging.row];
        const targetRowArr = updatedShelves[selectedSide][targetShelf][targetRow];
  
        if (dragging.index >= sourceRow.length) return prevItems;
  
        const [movedItem] = sourceRow.splice(dragging.index, 1);
        targetRowArr.push(movedItem);
      }
  
      return updatedShelves;
    });
  
    setDragging(null);
  };
  
  const addRow = (selectedSide: string, shelfIndex: number) => {
    setItemsPerShelf((prevItems) => {
      const updatedShelves = { ...prevItems };
      updatedShelves[selectedSide] = [...updatedShelves[selectedSide]]; // Create a shallow copy of the side array
      updatedShelves[selectedSide][shelfIndex] = [
        ...updatedShelves[selectedSide][shelfIndex],
        [], // Add a new empty row
      ];
      return updatedShelves;
    });
  };
  
  const removeRow = (selectedSide: string, shelfIndex: number, rowIndex: number) => {
    setItemsPerShelf((prevItems) => {
      const updatedShelves = { ...prevItems };
      updatedShelves[selectedSide] = [...updatedShelves[selectedSide]]; // Ensure a copy of the array
      updatedShelves[selectedSide][shelfIndex] = updatedShelves[selectedSide][shelfIndex].filter(
        (_, i) => i !== rowIndex
      ); // Remove the row at rowIndex
      return updatedShelves;
    });
  };  

  const saveConfiguration = () => {
    try {
      localStorage.setItem("shelfConfiguration", JSON.stringify(itemsPerShelf));
      alert("Configuration saved!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <ItemContext.Provider
      value={{
        itemsPerShelf,
        setItemsPerShelf,
        dragging,
        setDragging,
        handleDragStart,
        handleDropOnRow,
        addRow,
        removeRow,
        saveConfiguration,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

const defaultShelves = {
  Front: [[["Item A1", "Item A2"]], [["Item A3"]], [["Item A4", "Item A5"]], [[]], [["Item A6"]]],
  Back: [[["Item B1"]], [["Item B2", "Item B3"]], [[]], [["Item B4"]], [["Item B5", "Item B6"]]],
  Left: [[[]], [["Item C1"]], [["Item C2", "Item C3"]], [[]], [["Item C4"]]],
  Right: [[["Item D1", "Item D2"]], [[]], [["Item D3"]], [["Item D4"]], [["Item D5"]]],
  Top: [[["Item E1"]], [["Item E2"]], [["Item E3"]], [["Item E4"]], [["Item E5", "Item E6"]]],
};
