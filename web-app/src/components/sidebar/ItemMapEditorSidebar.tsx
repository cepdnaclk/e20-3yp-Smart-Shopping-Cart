/**
 * ItemMapEditorSidebar - Sidebar panel displaying draggable inventory items.
 *
 * Displays inventory items in a grid format that can be dragged onto the layout editor grid.
 * Handles loading and error states when fetching inventory items from the server.
 * Includes buttons to switch between layout and inventory editors.
 *
 * @component
 */

import React, { useState } from "react";
import { useEditorContext } from "../../hooks/context/useEditorContext";
import { InventoryItem, Item } from "../../types/Item";
import { useItemContext } from "../../hooks/context/useItemContext";
import { inventoryService } from "../../hooks/services/inventoryService";

const ItemMapEditorSidebar: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toggleEditor } = useEditorContext();

    const { inventoryItems, setInventoryItems, setDragging} = useItemContext();

    /**
     * Fetches inventory items from the server and updates context state.
     * Manages loading and error states accordingly.
     */
    const fetchInventory = async () => {
        try {
            setLoading(true);
            setError(null);
            const items = await inventoryService.getInventoryItems();
            if (!items) {
                throw new Error("No inventory items received from server");
            }
            setInventoryItems(items);
        } catch (error) {
            console.error("Error fetching inventory:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load inventory items"
            );
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles the drag start event for an inventory item.
     * Prepares drag data and initializes drag state for drop handling.
     * @param e - Drag event object
     * @param itemInfo - Inventory item details being dragged
     */
    const handleItemDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        itemInfo: InventoryItem
    ) => {
        const draggedItem: Item = {
            id: itemInfo._id, // Use the database ID
            name: itemInfo.name,
            row: 0,
            col: 0,
            index: 0,
        };

        setDragging({ edge: "", row: 0, col: 0, index: 0 });
        e.dataTransfer.setData("source", "sidebar");
        e.dataTransfer.setData("application/json", JSON.stringify(draggedItem));
    };
    return (
        <div
            style={{
                display: "flex",
                height: "100%",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Header message showing loading, error, or instructions */}
                <p
                    style={{
                        fontSize: "14px",
                        color: "rgba(153, 153, 153, 1)",
                        marginBottom: "12px",
                    }}
                >
                    {loading ? (
                        "Loading inventory items..."
                    ) : error ? (
                        <span style={{ color: "rgba(153, 153, 153, 1)" }}>{error}</span>
                    ) : (
                        "Drag items to add to your layout"
                    )}
                </p>

                {/* Retry button displayed only if there is an error */}
                {error && (
                    <button
                        onClick={fetchInventory}
                        style={{
                            padding: "8px 12px",
                            fontSize: "14px",
                            fontWeight: 500,
                            border: "2px solid #ddd",
                            borderRadius: "6px",
                            color: "rgba(153, 153, 153, 1)",
                            backgroundColor: "rgb(255, 255, 255)",
                            cursor: "pointer",
                        }}
                    >
                        Retry
                    </button>
                )}

                {/* Inventory items grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "10px",
                        opacity: loading ? 0.6 : 1,
                        pointerEvents: loading ? "none" : "auto",
                    }}
                >
                    {inventoryItems.map((item, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={(e) => handleItemDragStart(e, item)}
                            onDragEnd={() => setDragging(null)}
                            style={{
                                padding: "10px",
                                backgroundColor: "white",
                                color: "#333",
                                borderRadius: "8px",
                                cursor: "grab",
                                textAlign: "center",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                border: "1px solid #eee",
                                fontSize: "14px",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                            }}
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                style={{
                                    width: "100%",
                                    height: "80px",
                                    objectFit: "contain",
                                    marginBottom: "6px",
                                }}
                            />
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer with buttons to toggle editors */}
            <div
                style={{ flex: 1, flexDirection: "column", alignContent: "flex-end" }}
            >
                {/* Button to open Layout Editor */}
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
                        marginBottom: "10px",
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

                {/* Button to open Inventory Editor */}
                <button
                    onClick={() => toggleEditor("inventory")}
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
                    {"Open Inventory Editor"}
                </button>
            </div>
        </div>
    );
};

export default ItemMapEditorSidebar;
