import React from "react";
import { useSidebarContext } from "../hooks/useSidebarContext";
import LayoutEditorManager from "./layout_editor/LayoutEditorManager";
import ItemMapEditorManager from "./item_map_editor/ItemMapEditorManager";
import { ItemProvider } from "../context/ItemContext";
import SidebarManager from "./sidebar/SidebarManager";
import ToolbarManager from "./toolbar/ToolbarManager";

/**
 * UIManager - Root UI Component
 *
 * Main orchestrator component that manages the overall application layout and structure.
 * Provides ItemContext to all child components and conditionally renders different
 * editors based on application state.
 *
 * @component
 */

const UIManager: React.FC = () => {
  const { isSidebarVisible, isItemMapEditorOpen } = useSidebarContext();

  return (
    <ItemProvider>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ToolbarManager />

        {isSidebarVisible && <SidebarManager />}

        <LayoutEditorManager />

        {isItemMapEditorOpen && <ItemMapEditorManager />}
      </div>
    </ItemProvider>
  );
};

export default UIManager;
