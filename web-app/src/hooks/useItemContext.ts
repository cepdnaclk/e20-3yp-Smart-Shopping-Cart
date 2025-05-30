import { useContext } from "react";
import { ItemContext } from "../context/ItemContext";

/**
 * Custom hook for accessing ItemContext with error handling
 * Ensures hook is used within proper provider component
 */

export const useItemContext = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItemContext must be used within an ItemProvider");
  }
  return context;
};
