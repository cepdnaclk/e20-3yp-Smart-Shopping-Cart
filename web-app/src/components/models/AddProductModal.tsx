// src/components/models/AddProductModal.tsx
import React from "react";
import { X } from "lucide-react";
import FormField from "../form_fields/FormField";
import { ProductFormState } from "../../types/Item";
import styles from "./AddProductModal.module.css"; // Import the CSS module

interface AddProductModalProps {
    isOpen: boolean;
    formData: ProductFormState;
    loading: boolean;
    error: string | null;
    onSave: (e: React.FormEvent) => void;
    onCancel: () => void;
    onInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
    isOpen,
    formData,
    loading,
    error,
    onSave,
    onCancel,
    onInputChange,
    onFileChange,
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={`${styles.modalContent} scrollable-area`}>
                <button
                    onClick={onCancel}
                    className={styles.modalCloseButton}
                >
                    <X size={24} />
                </button>
                <h4 className={styles.modalTitle}>Add New Product</h4>
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
                            type="number"
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
                            type="number"
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
                            className={styles.primaryButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className={styles.loadingSpinner}></div>
                                    Saving...
                                </>
                            ) : (
                                "Add Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;