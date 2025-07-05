import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { ItemProps } from "../../types/Item";

const Item: React.FC<ItemProps> = ({
    id,
    name,
    imageUrl,
    count,
    removeItem,
    updateItemCount,
}) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{
                background: "white",
                borderRadius: "20px",
                padding: "10px",
                boxShadow: hovered
                    ? "0 12px 32px rgba(0, 0, 0, 0.15)"
                    : "0 4px 16px rgba(0, 0, 0, 0.2)",
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                border: "1px solid rgba(240, 240, 240, 1)",
                position: "relative",
                overflow: "hidden",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Header with Delete Button */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                    marginLeft: "6px",
                }}
            >
                <h3
                    style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#1a1a1a",
                        margin: 0,
                        lineHeight: "1.3",
                        flex: 1,
                    }}
                    title={name}
                >
                    {name}
                </h3>

                <button
                    onClick={() => removeItem(id)}
                    title="Delete item"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.27)",
                        border: "none",
                        borderRadius: "12px",
                        flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255, 65, 65, 0.85)";
                        e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.27)";
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                >
                    <Trash2 size={16} color="rgb(255, 255, 255)" strokeWidth={2} />
                </button>
            </div>

            {/* Image */}
            <div
                style={{
                    marginBottom: "6px",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "16px",
                }}
            >
                <img
                    src={imageUrl}
                    alt={name}
                    style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "16px",
                        transition: "transform 0.3s ease",
                        transform: hovered ? "scale(1.02)" : "scale(1)",
                    }}
                />
            </div>

            {/* Quantity Input */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(0, 0, 0, 0.15)",
                    padding: "6px 6px",
                    borderRadius: "12px",
                }}
            >
                <span
                    style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "rgb(111, 111, 111)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginLeft: "6px",
                    }}
                >
                    Quantity
                </span>

                <input
                    title="Item Count"
                    type="number"
                    value={count}
                    onChange={(e) => updateItemCount(id, parseInt(e.target.value) || 0)}
                    min="0"
                    style={{
                        width: "80px",
                        padding: "8px 12px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "8px",
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: 600,
                        backgroundColor: "white",
                        color: "#1e293b",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                    }}
                />
            </div>
        </div>
    );
};
export default Item;
