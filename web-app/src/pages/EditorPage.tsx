/**
 * EditorPage - Root UI Component
 *
 * Main orchestrator of the application UI.
 * Provides ItemContext to child components and manages layout including toolbar, sidebar,
 * and conditional rendering of editor components based on active editor state.
 *
 * @component
 */

import React, { useCallback } from "react";
import { useSidebarContext } from "../hooks/context/useSidebarContext";
import LayoutEditorManager from "../components/layout_editor/LayoutEditorManager";
import ItemMapEditorManager from "../components/item_map_editor/ItemMapEditorManager";
import { ItemProvider } from "../context/ItemContext";
import SidebarManager from "../components/sidebar/SidebarManager";
import ToolbarManager from "../components/toolbar/ToolbarManager";
import { useEditorContext } from "../hooks/context/useEditorContext";
import InventoryEditorManager from "../components/inventory_editor/InventoryEditorManager";
import ConfirmationModal from "../components/models/ConfirmationModal";
import { useModalContext } from "../hooks/context/useModalContext";
import AddProductModal from "../components/models/AddProductModal";
import UpdateProductModal from "../components/models/UpdateProductModal";
import { useItemContext } from "../hooks/context/useItemContext";
import {
    productService,
    AddProductPayload,
    UpdateProductPayload,
} from "../hooks/services/productService";
import { ModalProvider } from "../context/ModalContext";

/**
 * EditorPage component renders the main app layout:
 * - Wraps children in ItemProvider for item-related state management
 * - Shows ToolbarManager at the top
 * - Conditionally renders SidebarManager based on sidebar visibility state
 * - Conditionally renders one of the editor managers based on the active editor
 */

const EditorPage: React.FC = () => {
    const { isSidebarVisible } = useSidebarContext();
    const { activeEditor } = useEditorContext();

    const {
        showAddForm,
        showUpdateForm,
        showConfirmModal,
        productToDeleteBarcode,
        currentBarcode,
        setCurrentBarcode,
        closeAddForm,
        closeUpdateForm,
        closeConfirmModal,
        formData,
        handleInputChange,
        handleFileChange,
        resetForm,
        error,
        setError,
        setMessage,
        loading,
        setLoading,
    } = useModalContext();

    const { products, setProducts, setFilteredProducts } = useItemContext();

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

    const validateProductForm = useCallback(() => {
        const {
            productName,
            productDescription,
            productPrice,
            productQuantity,
            productCategory,
            productShelfNumber,
            productRowNumber,
            productBrand,
            productWeight,
        } = formData;

        if (
            !productName ||
            !productDescription ||
            !productPrice ||
            !productQuantity ||
            !productCategory ||
            !productShelfNumber ||
            !productRowNumber ||
            !productBrand ||
            !productWeight
        ) {
            setError("All fields are required.");
            return false;
        }
        if (isNaN(+productPrice) || +productPrice <= 0) {
            setError("Product Price must be a positive number.");
            return false;
        }
        if (
            isNaN(+productQuantity) ||
            !Number.isInteger(+productQuantity) ||
            +productQuantity < 0
        ) {
            setError("Product Quantity must be a non-negative integer.");
            return false;
        }
        if (
            isNaN(+productShelfNumber) ||
            !Number.isInteger(+productShelfNumber) ||
            +productShelfNumber <= 0
        ) {
            setError("Product Shelf Number must be a positive integer.");
            return false;
        }
        if (
            isNaN(+productRowNumber) ||
            !Number.isInteger(+productRowNumber) ||
            +productRowNumber <= 0
        ) {
            setError("Product Row Number must be a positive integer.");
            return false;
        }
        if (isNaN(+productWeight) || +productWeight <= 0) {
            setError("Product Weight must be a positive number.");
            return false;
        }

        setError(null);
        return true;
    }, [formData, setError]);

    const handleAddSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!validateProductForm()) return;

            setLoading(true);
            setMessage(null);
            setError(null);

            try {
                const payload: AddProductPayload = {
                    productName: formData.productName,
                    productDescription: formData.productDescription,
                    productPrice: +formData.productPrice,
                    productQuantity: +formData.productQuantity,
                    productCategory: formData.productCategory,
                    productShelfNumber: +formData.productShelfNumber,
                    productRowNumber: +formData.productRowNumber,
                    productBrand: formData.productBrand,
                    productWeight: +formData.productWeight,
                };

                const successMessage = await productService.addProduct(
                    payload,
                    formData.productImage
                );
                setMessage(successMessage);
                resetForm();
                closeAddForm();
                handleFetchAllProducts();
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to add product.");
            } finally {
                setLoading(false);
            }
        },
        [
            formData,
            validateProductForm,
            resetForm,
            handleFetchAllProducts,
            closeAddForm,
            setMessage,
            setError,
        ]
    );

    const handleUpdateSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!validateProductForm() || !currentBarcode) return;

            setLoading(true);
            setMessage(null);
            setError(null);

            try {
                const payload: UpdateProductPayload = {
                    barcode: currentBarcode,
                    productName: formData.productName,
                    productDescription: formData.productDescription,
                    productPrice: +formData.productPrice,
                    productQuantity: +formData.productQuantity,
                    productCategory: formData.productCategory,
                    productShelfNumber: +formData.productShelfNumber,
                    productRowNumber: +formData.productRowNumber,
                    productBrand: formData.productBrand,
                    productWeight: +formData.productWeight,
                };

                const successMessage = await productService.updateProduct(
                    payload,
                    formData.productImage
                );
                setMessage(successMessage);
                resetForm();
                setCurrentBarcode(null);
                closeUpdateForm();
                handleFetchAllProducts();
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to update product.");
            } finally {
                setLoading(false);
            }
        },
        [
            formData,
            validateProductForm,
            currentBarcode,
            resetForm,
            closeUpdateForm,
            setCurrentBarcode,
            handleFetchAllProducts,
            setMessage,
            setError,
        ]
    );

    const confirmDeleteProduct = useCallback(async () => {
        closeConfirmModal();
        if (!productToDeleteBarcode) return;
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const successMessage = await productService.deleteProduct(
                productToDeleteBarcode
            );
            setMessage(successMessage);
            handleFetchAllProducts();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete product.");
        } finally {
            setLoading(false);
        }
    }, [productToDeleteBarcode, handleFetchAllProducts]);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Always show the top toolbar */}
            <ToolbarManager />

            {/* Show sidebar if it's toggled visible */}
            {isSidebarVisible && <SidebarManager />}

            {/* Render the active editor manager */}
            {activeEditor === "inventory" && <InventoryEditorManager />}
            {activeEditor === "layout" && <LayoutEditorManager />}
            {activeEditor === "itemMap" && <ItemMapEditorManager />}

            <AddProductModal
                isOpen={showAddForm}
                formData={formData}
                loading={loading}
                error={error}
                onSave={handleAddSubmit}
                onCancel={closeAddForm}
                onInputChange={handleInputChange}
                onFileChange={handleFileChange}
            />

            <UpdateProductModal
                isOpen={showUpdateForm}
                formData={formData}
                loading={loading}
                error={error}
                currentProduct={products.find((p) => p.barcode === currentBarcode)}
                onSave={handleUpdateSubmit}
                onCancel={closeUpdateForm}
                onInputChange={handleInputChange}
                onFileChange={handleFileChange}
            />

            <ConfirmationModal
                isOpen={showConfirmModal}
                title="Delete Product"
                message={`Are you sure you want to delete the product with barcode: ${productToDeleteBarcode}? This action cannot be undone.`}
                confirmText="Delete Product"
                cancelText="Cancel"
                onConfirm={confirmDeleteProduct}
                onCancel={closeConfirmModal}
                isDestructive={true}
            />
        </div>
    );
};

export default EditorPage;
