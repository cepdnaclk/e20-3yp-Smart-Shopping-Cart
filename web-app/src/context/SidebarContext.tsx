/**
 * SidebarContext controls UI sidebar visibility and modal states.
 * Manages both the main sidebar and inventory editor popup.
 */

import { createContext, useState, ReactNode } from "react";

/**
 * Context interface for sidebar management operations
 * @interface SidebarContextType
 */
interface SidebarContextType {
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(false);

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

  return (
    <SidebarContext.Provider
      value={{
        isSidebarVisible,
        toggleSidebar,
        closeSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
