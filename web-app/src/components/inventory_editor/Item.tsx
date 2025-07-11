import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { ItemProps, Product } from "../../types/Item";

const Item: React.FC<ItemProps> = ({
    barcode,
    productName,
    productCategory,
    productBrand,
    productPrice,
    productQuantity,
    productShelfNumber,
    removeItem,
    updateItem,
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
            {/* Header with Product Name and Delete Button */}
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
                    title={productName}
                >
                    {productName}
                </h3>

                <button
                    onClick={() => removeItem(barcode)}
                    title="Delete item"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.27)",
                        border: "none",
                        borderRadius: "12px",
                        flexShrink: 0,
                        padding: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
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

            {/* Brand and Category */}
            <div style={{ marginBottom: "8px", marginLeft: "6px" }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                    <span
                        style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#64748b",
                            backgroundColor: "#f1f5f9",
                            padding: "2px 6px",
                            borderRadius: "6px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}
                    >
                        {productBrand}
                    </span>
                    <span
                        style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#64748b",
                            backgroundColor: "#f1f5f9",
                            padding: "2px 6px",
                            borderRadius: "6px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}
                    >
                        {productCategory}
                    </span>
                </div>
            </div>

            {/* Image Placeholder */}
            <div
                style={{
                    marginBottom: "8px",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "16px",
                }}
            >
                <img
                    src="https://via.placeholder.com/300x180/e2e8f0/64748b?text=No+Image+Available"
                    alt="Product image not available"
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

            {/* Price */}
            <div
                style={{
                    marginBottom: "8px",
                    marginLeft: "6px",
                }}
            >
                <span
                    style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#059669",
                    }}
                >
                    ${productPrice?.toFixed(2)}
                </span>
            </div>

            {/* Barcode */}
            <div
                style={{
                    marginBottom: "8px",
                    marginLeft: "6px",
                }}
            >
                <span
                    style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#64748b",
                        fontFamily: "monospace",
                    }}
                >
                    Barcode: {barcode}
                </span>
            </div>

            {/* Shelf Number */}
            <div
                style={{
                    marginBottom: "8px",
                    marginLeft: "6px",
                }}
            >
                <span
                    style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#64748b",
                    }}
                >
                    Shelf: {productShelfNumber}
                </span>
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
                    title="Item Quantity"
                    type="number"
                    value={productQuantity}
                    onChange={(e) =>
                        updateItem({
                            barcode,
                            productName,
                            productCategory,
                            productBrand,
                            productPrice,
                            productQuantity: Number(e.target.value),
                            productShelfNumber,
                        } as Product)
                    }
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
                    onFocus={(e) => {
                        e.target.style.borderColor = "#3b82f6";
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                    }}
                />
            </div>
        </div>
    );
};

export default Item;