import { useContext } from "react";
import { SidebarContext } from "../context/SidebarContext";

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within an SidebarProvider");
  }
  return context;
};
