import React, { createContext, useState } from "react";

interface ShelfContextProps {
  selectedSide: string;
  setSelectedSide: React.Dispatch<React.SetStateAction<string>>;
  selectedShelf: number | null;
  setSelectedShelf: React.Dispatch<React.SetStateAction<number | null>>;
}

export const ShelfContext = createContext<ShelfContextProps | undefined>(undefined);

export const ShelfProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSide, setSelectedSide] = useState<string>("Front");
  const [selectedShelf, setSelectedShelf] = useState<number | null>(null);

  return (
    <ShelfContext.Provider value={{ selectedSide, setSelectedSide, selectedShelf, setSelectedShelf }}>
      {children}
    </ShelfContext.Provider>
  );
};