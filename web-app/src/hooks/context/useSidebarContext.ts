import { useContext } from "react";
import { SidebarContext } from "../../context/SidebarContext";

/**
 * Custom hook for accessing SidebarContext with error handling
 * Ensures hook is used within proper provider component
 */

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within an SidebarProvider");
  }
  return context;
};
