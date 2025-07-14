// src/components/models/UpdateProductModal.tsx
import React from "react";
import { X } from "lucide-react";
import FormField from "../form_fields/FormField";
import { Product, ProductFormState } from "../../types/Item";
import styles from "./UpdateProductModal.module.css"; // Import the CSS Module

interface UpdateProductModalProps {
    isOpen: boolean;
    formData: ProductFormState;
    loading: boolean;
    error: string | null;
    currentProduct: Product | undefined; // Pass the product to be updated
    onSave: (e: React.FormEvent) => void;
    onCancel: () => void;
    onInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
    isOpen,
    formData,
    loading,
    error,
    currentProduct,
    onSave,
    onCancel,
    onInputChange,
    onFileChange,
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onCancel}> {/* Click overlay to close */}
            <div className={`${styles.modalContent} scrollable-area`} onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside modal */}
                <button
                    onClick={onCancel}
                    className={styles.modalCloseButton}
                    aria-label="Close modal"
                >
                    <X size={24} />
                </button>
                <h4 className={styles.modalTitle}>
                    Update Product (Barcode: {currentProduct?.barcode})
                </h4>
                <form onSubmit={onSave}>
                    <div className={styles.formGrid}>
                        <FormField
                            label="Product Name"
                            name="productName"
                            type="text"
                            value={formData.productName}
                            onChange={onInputChange}
                            placeholder="Enter product name"
                            required
                        />
                        <FormField
                            label="Product Description"
                            name="productDescription"
                            type="textarea"
                            value={formData.productDescription}
                            onChange={onInputChange}
                            placeholder="Describe the product"
                            required
                        />
                        <FormField
                            label="Product Price"
                            name="productPrice"
                            type="number"
                            value={formData.productPrice}
                            onChange={onInputChange}
                            placeholder="e.g., 99.99"
                            required
                        />
                        <FormField
                            label="Product Quantity"
                            name="productQuantity"
                            type="number"
                            value={formData.productQuantity}
                            onChange={onInputChange}
                            placeholder="e.g., 100"
                            required
                        />
                        <FormField
                            label="Product Category"
                            name="productCategory"
                            type="text" // Changed to text as per typical category names
                            value={formData.productCategory}
                            onChange={onInputChange}
                            placeholder="Electronics"
                            required
                        />
                        <FormField
                            label="Shelf Number"
                            name="productShelfNumber"
                            type="number"
                            value={formData.productShelfNumber.toString()}
                            onChange={onInputChange}
                            placeholder="e.g., 5"
                            required
                        />
                        <FormField
                            label="Row Number"
                            name="productRowNumber"
                            type="number"
                            value={formData.productRowNumber.toString()}
                            onChange={onInputChange}
                            placeholder="e.g., 3"
                            required
                        />
                        <FormField
                            label="Product Brand"
                            name="productBrand"
                            type="text" // Changed to text as per typical brand names
                            value={formData.productBrand}
                            onChange={onInputChange}
                            placeholder="Apple"
                            required
                        />
                        <FormField
                            label="Product Weight (kg)"
                            name="productWeight"
                            type="number"
                            value={formData.productWeight.toString()}
                            onChange={onInputChange}
                            placeholder="e.g., 1.5"
                            required
                        />
                        <div className={styles.fileInputContainer}>
                            <label htmlFor="productImage" className={styles.fileInputLabel}>
                                Product Image
                            </label>
                            <input
                                id="productImage"
                                name="productImage"
                                type="file"
                                onChange={onFileChange}
                                accept="image/*"
                                className={styles.fileInputField}
                            />
                        </div>
                    </div>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={onCancel}
                            className={styles.secondaryButton}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`${styles.primaryButton} ${loading ? styles.disabledButton : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className={styles.loadingSpinner}></div>
                                    Saving...
                                </>
                            ) : (
                                "Update Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProductModal;