/**
 * EditorPage - Root UI Component
 *
 * Main orchestrator of the application UI.
 * Provides ItemContext to child components and manages layout including toolbar, sidebar,
 * and conditional rendering of editor components based on active editor state.
 *
 * @component
 */

import React from "react";
import { useSidebarContext } from "../hooks/context/useSidebarContext";
import LayoutEditorManager from "../components/layout_editor/LayoutEditorManager";
import ItemMapEditorManager from "../components/item_map_editor/ItemMapEditorManager";
import { ItemProvider } from "../context/ItemContext";
import SidebarManager from "../components/sidebar/SidebarManager";
import ToolbarManager from "../components/toolbar/ToolbarManager";
import { useEditorContext } from "../hooks/context/useEditorContext";
import InventoryEditorManager from "../components/inventory_editor/InventoryEditorManager";

/**
 * EditorPage component renders the main app layout:
 * - Wraps children in ItemProvider for item-related state management
 * - Shows ToolbarManager at the top
 * - Conditionally renders SidebarManager based on sidebar visibility state
 * - Conditionally renders one of the editor managers based on the active editor
 */

const EditorPage: React.FC = () => {
  const { isSidebarVisible } = useSidebarContext();
  const { activeEditor } = useEditorContext();

  return (
    <ItemProvider>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* Always show the top toolbar */}
        <ToolbarManager />

        {/* Show sidebar if it's toggled visible */}
        {isSidebarVisible && <SidebarManager />}

        {/* Render the active editor manager */}
        {activeEditor === "inventory" && <InventoryEditorManager />}
        {activeEditor === "layout" && <LayoutEditorManager />}
        {activeEditor === "itemMap" && <ItemMapEditorManager />}
      </div>
    </ItemProvider>
  );
};

export default EditorPage;
