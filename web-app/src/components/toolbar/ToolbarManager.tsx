import React from "react";
import { useSidebarContext } from "../../hooks/context/useSidebarContext";
import { Menu } from "lucide-react";
import ItemMapEditorToolbar from "./ItemMapEditorToolbar";
import LayoutEditorToolbar from "./LayoutEditorToolbar";
import { useEditorContext } from "../../hooks/context/useEditorContext";
import InventoryEditorToolbar from "./InventoryEditorToolbar";
import UserMenu from "./UserMenu";
import styles from './ToolbarManager.module.css';

/**
 * ToolbarManager - Global Navigation Toolbar
 *
 * Fixed-position toolbar that provides global navigation and context-sensitive controls.
 * Dynamically renders different toolbar content based on the current editor mode.
 */

const ToolbarManager: React.FC = () => {
    const { toggleSidebar } = useSidebarContext();
    const { activeEditor } = useEditorContext();

    return (
        <div className={styles.toolbarContainer}>
            {/* Left Side: Sidebar toggle button with hamburger menu icon */}
            <button
                onClick={toggleSidebar}
                className={styles.sidebarToggleButton}
                title="Toggle Sidebar"
            >
                <Menu size={24} />
            </button>

            {/* Center: Dynamic title based on current editor mode */}
            <h2 className={styles.title}>
                {activeEditor === "inventory" && "Inventory Editor"}
                {activeEditor === "layout" && "Layout Editor"}
                {activeEditor === "itemMap" && "Item Map Editor"}
            </h2>

            {/* Right Side: Conditional toolbar rendering based on editor state */}
            <div className={styles.rightToolbar}>
                {activeEditor === "inventory" && <InventoryEditorToolbar />}
                {activeEditor === "layout" && <LayoutEditorToolbar />}
                {activeEditor === "itemMap" && <ItemMapEditorToolbar />}
                <UserMenu />
            </div>
        </div>
    );
};

export default ToolbarManager;
