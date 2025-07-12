import { useContext } from "react";
import { EditorContext } from "../../context/EditorContext";

/**
 * Custom hook for accessing EditorContext with error handling
 * Ensures hook is used within proper provider component
 */

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
};
