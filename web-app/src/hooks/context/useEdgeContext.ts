import { useContext } from "react";
import { EdgeContext } from "../../context/EdgeContext";

/**
 * Custom hook for accessing EdgeContext with error handling
 * Ensures hook is used within proper provider component
 */

export const useEdgeContext = () => {
  const context = useContext(EdgeContext);
  if (!context) {
    throw new Error("useEdgeContext must be used within an EdgeProvider");
  }
  return context;
};
