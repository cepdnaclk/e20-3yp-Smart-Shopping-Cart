import React, { useState } from "react";
import { useItemContext } from "../../hooks/useItemContext";
import { Plus, Save } from "lucide-react";
import { InventoryItem } from "../../types/Item";
import {saveInventoryData } from "../../utils/SaveData";

/**
 * InventoryEditorToolbar - Item Map Editor Action Bar
 *
 * Simplified toolbar for item map editing operations.
 * Provides data persistence functionality with save and clear operations.
 *
 * @component
 */

const InventoryEditorToolbar: React.FC = () => {
    // Initialize inventoryItems to an empty array
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemImageUrl, setNewItemImageUrl] = useState("");

    const { inventoryItems, setInventoryItems } = useItemContext();

    const addItem = () => {
        if (newItemName.trim() && newItemImageUrl.trim()) {
            const newItem: InventoryItem = {
                _id: crypto.randomUUID(),
                name: newItemName.trim(),
                imageUrl: newItemImageUrl.trim(),
                count: 1,
            };
            setInventoryItems([...inventoryItems, newItem]);
            setNewItemName("");
            setNewItemImageUrl("");
            setShowAddModal(false);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <button
                onClick={() => setShowAddModal(true)}
                style={{
                    padding: "10px 16px",
                    border: "2px solid #ddd",
                    borderRadius: "6px",
                    color: "rgb(102, 102, 102)",
                    backgroundColor: "rgb(255, 255, 255)",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginRight: "10px",
                    transition: "background-color 0.2s",
                    display: "flex",
                    alignItems: "center",
                }}
                title="Add Fixture"
            >
                <Plus size={16} color="rgb(102, 102, 102)" strokeWidth={2} />
            </button>

            {/* Save changes button with data persistence */}
            <button
                title="save"
                onClick={() => {
                    saveInventoryData(inventoryItems);
                }}
                style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    fontWeight: 500,
                    border: "2px solid #ddd",
                    borderRadius: "6px",
                    color: "rgb(102, 102, 102)",
                    backgroundColor: "rgb(255, 255, 255)",
                    cursor: "pointer",
                    marginRight: "10px",
                }}
            >
                <Save size={17} color="rgb(102, 102, 102)" strokeWidth={2} />
            </button>

            {/* Modal */}
            {showAddModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 999,
                        backdropFilter: "blur(4px)",
                    }}
                >
                    <div
                        style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            padding: "32px",
                            borderRadius: "16px",
                            width: "420px",
                            maxWidth: "90%",
                            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
                            transition: "all 0.3s ease-in-out",
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "22px",
                                fontWeight: "600",
                                color: "rgba(34, 34, 34, 1)",
                                margin: 0,
                            }}
                        >
                            Add New Inventory Item
                        </h3>

                        <div
                            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                        >
                            <label
                                style={{
                                    fontWeight: 500,
                                    color: "rgba(51, 51, 51, 1)",
                                }}
                            >
                                Item Name
                            </label>
                            <input
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder="Enter item name"
                                style={{
                                    width: "100%",
                                    padding: "12px 14px",
                                    border: "1px solid rgba(200, 200, 200, 1)",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    background: "rgba(255, 255, 255, 1)",
                                    color: "rgba(0, 0, 0, 0.85)",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        <div
                            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                        >
                            <label
                                style={{
                                    fontWeight: 500,
                                    color: "rgba(51, 51, 51, 1)",
                                }}
                            >
                                Image URL
                            </label>
                            <input
                                type="url"
                                value={newItemImageUrl}
                                onChange={(e) => setNewItemImageUrl(e.target.value)}
                                placeholder="Enter image URL"
                                style={{
                                    width: "100%",
                                    padding: "12px 14px",
                                    border: "1px solid rgba(200, 200, 200, 1)",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    background: "rgba(255, 255, 255, 1)",
                                    color: "rgba(0, 0, 0, 0.85)",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "12px",
                                marginTop: "12px",
                            }}
                        >
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewItemName("");
                                    setNewItemImageUrl("");
                                }}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    backgroundColor: "rgba(245, 245, 245, 1)",
                                    border: "1px solid rgba(220, 220, 220, 1)",
                                    color: "rgba(80, 80, 80, 1)",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addItem}
                                disabled={!newItemName.trim() || !newItemImageUrl.trim()}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    backgroundColor:
                                        newItemName.trim() && newItemImageUrl.trim()
                                            ? "rgb(3, 160, 222)"
                                            : "rgba(200, 200, 200, 1)",
                                    color: "rgba(255, 255, 255, 1)",
                                    border: "none",
                                    cursor:
                                        newItemName.trim() && newItemImageUrl.trim()
                                            ? "pointer"
                                            : "not-allowed",
                                    transition: "background-color 0.2s",
                                }}
                            >
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryEditorToolbar;
