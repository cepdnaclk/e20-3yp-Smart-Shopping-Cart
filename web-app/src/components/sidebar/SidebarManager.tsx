import React from "react";
import { useSidebarContext } from "../../hooks/context/useSidebarContext";
import LayoutEditorSidebar from "./LayoutEditorSidebar";
import ItemMapEditorSidebar from "./ItemMapEditorSidebar";
import { useEditorContext } from "../../hooks/context/useEditorContext";
import InventoryEditorSidebar from "./InventoryEditorSidebar";
import styles from "./SidebarManager.module.css";

const SidebarManager: React.FC = () => {
  const { closeSidebar } = useSidebarContext();
  const { activeEditor } = useEditorContext();

  return (
    <div className={styles.sidebarContainer}>
      {/* Sidebar header with dynamic title and close button */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          {activeEditor === "inventory" && "Categories"}
          {activeEditor === "layout" && "Properties"}
          {activeEditor === "itemMap" && "Inventory"}
        </h2>
        <button
          onClick={closeSidebar}
          className={styles.closeButton}
          title="Close Sidebar"
          aria-label="Close Sidebar"
        >
          ✕
        </button>
      </div>

      {/* Dynamic content area */}
      <div className={styles.content}>
        {activeEditor === "inventory" && <InventoryEditorSidebar />}
        {activeEditor === "layout" && <LayoutEditorSidebar />}
        {activeEditor === "itemMap" && <ItemMapEditorSidebar />}
      </div>

      
    </div>
  );
};

export default SidebarManager;
