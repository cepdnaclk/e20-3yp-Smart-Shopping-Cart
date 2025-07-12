import { useContext } from "react";
import { NodeContext } from "../../context/NodeContext";

/**
 * Custom hook for accessing NodeContext with error handling
 * Ensures hook is used within proper provider component
 */

export const useNodeContext = () => {
  const context = useContext(NodeContext);
  if (!context) {
    throw new Error("useNodeContext must be used within an NodeProvider");
  }
  return context;
};
