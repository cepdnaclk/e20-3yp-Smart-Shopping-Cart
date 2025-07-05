/**
 * InventoryEditorSidebar - Inventory Panel for Item Management
 *
 * Provides a draggable inventory of items that can be added to the layout.
 * Items are displayed in a grid format with images and can be dragged
 * onto the item map editor grid.
 *
 * @component
 */

import React from "react";
import { useEditorContext } from "../../hooks/useEditorContext";


const InventoryEditorSidebar: React.FC = () => {

    // Using editor context to enable toggling between editors (e.g., switch to layout editor)
    const { toggleEditor } = useEditorContext();

    /**
     * Initiates drag operation for an item in the inventory
     * Sets up drag state and data transfer for drop handling
     * @param e - Drag event
     * @param itemInfo - Information about the item
     */
    return (
        <div style={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "flex-end" }}>
            {/* Spacer to push footer button to the bottom */}
            <div style={{ flex: 1 }} />

            {/* Button to switch to the layout editor */}
            <button
                onClick={() => toggleEditor("layout")}
                style={{
                    width: "100%",
                    padding: "10px 0",
                    color: "rgb(255, 255, 255)",
                    backgroundColor: "rgb(3, 160, 222)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500,
                    transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgb(2, 141, 196)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "rgb(3, 160, 222)";
                }}
            >
                {"Open Layout Editor"}
            </button>
        </div>
    );
};

export default InventoryEditorSidebar;
