import React, { useCallback, useEffect, useState } from "react";
import { useEditorContext } from "../../hooks/context/useEditorContext";
import { InventoryItem, Item, Product } from "../../types/Item";
import { useItemContext } from "../../hooks/context/useItemContext";
import styles from "./ItemMapEditorSidebar.module.css";
import { productService } from "../../hooks/services/productService";

const ItemMapEditorSidebar: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toggleEditor } = useEditorContext();
    const { products, setProducts, setFilteredProducts, setDragging } = useItemContext();
    const [message, setMessage] = useState<string | null>(null);

    // utils/getProductImageSrc.ts
    function getProductImageSrc(productImage: string | File | undefined): string {
        if (productImage instanceof File) {
            return URL.createObjectURL(productImage);
        } else if (
            typeof productImage === "string" &&
            productImage.startsWith("http")
        ) {
            return productImage;
        } else {
            return "https://thumbs.dreamstime.com/b/art-illustration-317105366.jpg";
        }
    }

    useEffect(() => {
        handleFetchAllProducts();
    }, []);

    const handleFetchAllProducts = useCallback(async () => {
        setLoading(true);
        setMessage(null);
        setError(null);
        try {
            const fetchedProducts = await productService.getAllProducts();
            setProducts(fetchedProducts);
            setFilteredProducts(fetchedProducts);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch products.");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleItemDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        itemInfo: Product
    ) => {
        const draggedItem: Item = {
            id: itemInfo.barcode,
            name: itemInfo.productName,
            row: 0,
            col: 0,
            index: 0,
        };
        setDragging({ edge: "", row: 0, col: 0, index: 0 });
        e.dataTransfer.setData("source", "sidebar");
        e.dataTransfer.setData("application/json", JSON.stringify(draggedItem));
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.content} scrollable-area`}>
                <p className={styles.message}>
                    {loading ? (
                        "Loading inventory items..."
                    ) : error ? (
                        <span className={styles.message}>{error}</span>
                    ) : (
                        "Drag items to add to your layout"
                    )}
                </p>

                {error && (
                    <button
                        onClick={handleFetchAllProducts}
                        className={styles.retryButton}
                    >
                        Retry
                    </button>
                )}

                <div className={`${styles.grid} ${loading ? styles.gridDisabled : ""}`}>
                    {products.map((item, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={(e) => handleItemDragStart(e, item)}
                            onDragEnd={() => setDragging(null)}
                            className={styles.item}
                        >
                            <img
                                src={getProductImageSrc(item.productImage)}
                                alt={item.productName}
                                className={styles.itemImage}
                                onError={(e) => {
                                    const fallback =
                                        "https://thumbs.dreamstime.com/b/art-illustration-317105366.jpg";
                                    if ((e.target as HTMLImageElement).src !== fallback) {
                                        (e.target as HTMLImageElement).src = fallback;
                                    }
                                }}
                            />
                            {item.productName}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.footer}>
                <button
                    onClick={() => toggleEditor("layout")}
                    className={styles.button}
                >
                    Open Layout Editor
                </button>
                <button
                    onClick={() => toggleEditor("inventory")}
                    className={styles.button}
                >
                    Open Inventory Editor
                </button>
            </div>
        </div>
    );
};

export default ItemMapEditorSidebar;
