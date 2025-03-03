import { createContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  isInventoryOpen: boolean;
  toggleInventoryEditor: () => void;
  closeInventoryEditor: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [isInventoryOpen, setInventoryOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
    console.log((!isSidebarVisible ? "Open" : "Close") + " sidebar"); // consol.log is evaluated before any state updates
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
    console.log((!isSidebarVisible ? "Open" : "Close") + " sidebar"); // consol.log is evaluated before any state updates
  };


  const toggleInventoryEditor = () => {
    setInventoryOpen((prev) => !prev);
    console.log((!isInventoryOpen ? "Open" : "Close") + " inventory editor"); // consol.log is evaluated before any state updates
  };

  const closeInventoryEditor = () => {
    setInventoryOpen(false);
    console.log((!isInventoryOpen ? "Open" : "Close") + " inventory editor"); // consol.log is evaluated before any state updates
  };

  return (
    <SidebarContext.Provider value={{ isSidebarVisible, toggleSidebar, closeSidebar, isInventoryOpen, toggleInventoryEditor, closeInventoryEditor }}>
      {children}
    </SidebarContext.Provider>
  );
};
