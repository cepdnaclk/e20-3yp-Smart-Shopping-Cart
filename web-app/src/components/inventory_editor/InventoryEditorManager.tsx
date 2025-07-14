import { useCallback, useEffect } from "react";
import Item from "./Item";
import {
    productService,
} from "../../hooks/services/productService";
import { Product } from "../../types/Item";
import styles from "./InventoryEditorManager.module.css";
import { useModalContext } from "../../hooks/context/useModalContext";
import { useItemContext } from "../../hooks/context/useItemContext";

const InventoryEditorManager = () => {

    const {
        setCurrentBarcode,
        openUpdateForm,
        openConfirmModal,
        setFormData,
        error,
        setError,
        setMessage,
        setLoading
    } = useModalContext();

    const { filteredProducts, setProducts, setFilteredProducts } = useItemContext();

    const handleFetchAllProducts = useCallback(async () => {
        setLoading(true);
        setMessage(null);
        setError(null);
        try {
            const fetched = await productService.getAllProducts();
            setProducts(fetched);
            setFilteredProducts(fetched);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch products.");
        } finally {
            setLoading(false);
        }
    }, [setMessage, setError]);

    useEffect(() => {
        handleFetchAllProducts();
    }, [handleFetchAllProducts]);

    const handleEditClick = (product: Product) => {
        setFormData({
            barcode: product.barcode || "",
            productName: product.productName,
            productDescription: product.productDescription,
            productPrice: product.productPrice.toString(),
            productQuantity: product.productQuantity.toString(),
            productCategory: product.productCategory,
            productShelfNumber: product.productShelfNumber,
            productRowNumber: product.productRowNumber,
            productBrand: product.productBrand,
            productWeight: product.productWeight,
            productImage: undefined,
        });
        setCurrentBarcode(product.barcode || null);
        openUpdateForm();
        setMessage(null);
        setError(null);
    };

    const handleDeleteClick = (barcode: string) => {
        setMessage(null);
        setError(null);
        openConfirmModal(barcode);
    };


    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <div className={styles.grid}>
                    {filteredProducts.map((item) => (
                        <Item
                            key={item.barcode}
                            barcode={item.barcode}
                            removeItem={handleDeleteClick}
                            updateItem={handleEditClick}
                            productName={item.productName}
                            productCategory={item.productCategory}
                            productBrand={item.productBrand}
                            productPrice={item.productPrice}
                            productQuantity={item.productQuantity}
                            productShelfNumber={item.productShelfNumber}
                            productImage={item.productImage}
                            productDescription={item.productDescription}
                            productRowNumber={item.productRowNumber}
                            productWeight={item.productWeight}
                        />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className={styles.emptyState}>
                        {error ? (
                            <>
                                <div className={styles.errorText}>{error}</div>
                                <button
                                    className={styles.retryBtn}
                                    onClick={handleFetchAllProducts}
                                >
                                    Retry
                                </button>
                            </>
                        ) : (
                            <div className={styles.infoText}>
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
