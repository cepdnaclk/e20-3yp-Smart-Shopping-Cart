import { createContext, useState, ReactNode } from "react";

/**
 * SidebarContext controls UI sidebar visibility and modal states.
 * Manages both the main sidebar and inventory editor popup.
 */

/**
 * Context interface for sidebar management operations
 * @interface SidebarContextType
 */
interface SidebarContextType {
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  isItemMapEditorOpen: boolean;
  toggleEditors: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [isItemMapEditorOpen, setItemMapEditorOpen] = useState<boolean>(false);

  /**
   * Toggles the main sidebar visibility
   */
  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
    console.log((!isSidebarVisible ? "Open" : "Close") + " sidebar"); // consol.log is evaluated before any state updates
  };

  /**
   * Closes the main sidebar
   */
  const closeSidebar = () => {
    setSidebarVisible(false);
    console.log((!isSidebarVisible ? "Open" : "Close") + " sidebar"); // consol.log is evaluated before any state updates
  };

  /**
   * Toggles between the Layout Editor and Item Map Editor
   */
  const toggleEditors = () => {
    setItemMapEditorOpen((prev) => !prev);
    console.log((!isItemMapEditorOpen ? "Open" : "Close") + " item map editor");
  };

  return (
    <SidebarContext.Provider
      value={{
        isSidebarVisible,
        toggleSidebar,
        closeSidebar,
        isItemMapEditorOpen,
        toggleEditors,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
