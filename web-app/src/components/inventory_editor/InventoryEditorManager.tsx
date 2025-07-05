import { useEffect, useState } from "react";
import Item from "./Item";
import { useItemContext } from "../../hooks/useItemContext";
import { inventoryService } from "../../services/inventoryService";


const InventoryEditorManager = () => {

    const { inventoryItems, setInventoryItems } = useItemContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


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

    useEffect(() => {
        fetchInventory();
    }, []);

    // Initialize inventoryItems to an empty array
    const removeItem = (id: string) => {
        setInventoryItems(inventoryItems.filter((item) => item._id !== id));
    };

    const updateItemCount = (id: string, newCount: number) => {
        if (newCount < 0 || isNaN(newCount)) return;
        setInventoryItems(
            inventoryItems.map((item) =>
                item._id === id ? { ...item, count: newCount } : item
            )
        );
    };

    const incrementCount = (id: string) => {
        const item = inventoryItems.find((item) => item._id === id);
        if (!item) return;
        updateItemCount(id, item.count + 1);
    };

    const decrementCount = (id: string) => {
        const item = inventoryItems.find((item) => item._id === id);
        if (!item || item.count <= 0) return;
        updateItemCount(id, item.count - 1);
    };

    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                background: "rgb(255, 255, 255)",
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                zIndex: 998,
                color: "#333",
                fontFamily: "Inter, sans-serif",
            }}
        >
            {/* Main Content */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    marginTop: "50px",
                    padding: "20px",
                    background: "#fafafa",
                    borderRadius: "10px",
                    border: "1px solid #e0e0e0",
                }}
            >
                {/* Items Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "20px",
                        paddingBottom: "20px",
                    }}
                >
                    {inventoryItems.map((item) => (
                        <Item
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            imageUrl={item.imageUrl}
                            count={item.count}
                            removeItem={removeItem}
                            updateItemCount={updateItemCount}
                            incrementCount={incrementCount}
                            decrementCount={decrementCount}
                        />
                    ))}
                </div>

                {inventoryItems.length === 0 && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "250px",
                            textAlign: "center",
                            color: "rgba(153, 153, 153, 1)",
                        }}
                    >
                        {error ? (
                            <>
                                <div style={{ fontSize: "15px", marginBottom: "10px" }}>
                                    {error}
                                </div>
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
                            </>
                        ) : (
                            <div style={{ fontSize: "15px" }}>
                                No items in inventory. Click "Add Item" to get started.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryEditorManager;
