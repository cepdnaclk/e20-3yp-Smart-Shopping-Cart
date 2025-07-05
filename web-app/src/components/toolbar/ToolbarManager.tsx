import React from "react";
import { useSidebarContext } from "../../hooks/useSidebarContext";
import { Menu } from "lucide-react";
import ItemMapEditorToolbar from "./ItemMapEditorToolbar";
import LayoutEditorToolbar from "./LayoutEditorToolbar";
import { useEditorContext } from "../../hooks/useEditorContext";
import InventoryEditorToolbar from "./InventoryEditorToolbar";
import UserMenu from "./UserMenu";

/**
 * ToolbarManager - Global Navigation Toolbar
 *
 * Fixed-position toolbar that provides global navigation and context-sensitive controls.
 * Dynamically renders different toolbar content based on the current editor mode.
 *
 * Features:
 * - Sidebar toggle functionality
 * - Dynamic title display
 * - Context-sensitive action buttons
 * - Fixed positioning for consistent access
 */

const ToolbarManager: React.FC = () => {
    const { toggleSidebar } = useSidebarContext();
    const { activeEditor } = useEditorContext();

    return (
        <div
            style={{
                padding: "10px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "white",
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                height: "40px",
                zIndex: 999,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                color: "#333",
            }}
        >
            {/* Left Side: Sidebar toggle button with hamburger menu icon */}
            <button
                onClick={toggleSidebar}
                style={{
                    padding: "10px",
                    backgroundColor: "transparent",
                    color: "#333",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "18px",
                    fontWeight: 500,
                    transition: "background-color 0.2s",
                }}
                title="Toggle Sidebar"
            >
                <Menu size={24} />
            </button>

            {/* Center: Dynamic title based on current editor mode */}
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
                {activeEditor === "inventory" && "Inventory Editor"}

                {activeEditor === "layout" && "Layout Editor"}

                {activeEditor === "itemMap" && "Item Map Editor"}
            </h2>

            {/* Right Side: Conditional toolbar rendering based on editor state */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {activeEditor === "inventory" && <InventoryEditorToolbar />}
                {activeEditor === "layout" && <LayoutEditorToolbar />}
                {activeEditor === "itemMap" && <ItemMapEditorToolbar />}
                <UserMenu />
            </div>


        </div>
    );
};

export default ToolbarManager;
