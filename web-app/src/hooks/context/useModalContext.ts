import { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";

/**
 * Custom hook for accessing ModalContext with error handling
 * Ensures hook is used within proper provider component
 */

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within an EditorProvider");
  }
  return context;
};
