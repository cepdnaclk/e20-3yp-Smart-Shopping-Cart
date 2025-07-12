// src/components/models/AddProductModal.tsx
import React from "react";
import { X } from "lucide-react";
import FormField from "../form_fields/FormField";
import { ProductFormState } from "../../types/Item";


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

const styles = {
    modalOverlay: {
        position: "fixed" as "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        padding: "32px",
        width: "90%",
        maxWidth: "600px",
        position: "relative" as "relative",
        fontFamily: "Inter, system-ui, sans-serif",
        maxHeight: "90vh",
        overflowY: "auto" as "auto",
    },
    modalCloseButton: {
        position: "absolute" as "absolute",
        top: "16px",
        right: "16px",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "8px",
        color: "#64748b",
        transition: "color 0.2s ease, background-color 0.2s ease",
    },
    modalCloseButtonHover: {
        backgroundColor: "#f1f5f9",
        color: "#1e293b",
    },
    modalTitle: {
        fontSize: "20px",
        fontWeight: 600,
        color: "#1e293b",
        marginBottom: "24px",
        borderBottom: "1px solid #f1f5f9",
        paddingBottom: "16px",
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "16px",
    },
    formActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "32px",
        borderTop: "1px solid #f1f5f9",
        paddingTop: "24px",
    },
    primaryButton: {
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        fontSize: "14px",
        fontWeight: 500,
        borderRadius: "8px",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    primaryButtonHover: {
        backgroundColor: "#1d4ed8",
    },
    secondaryButton: {
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        fontSize: "14px",
        fontWeight: 500,
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        backgroundColor: "white",
        color: "#475569",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    secondaryButtonHover: {
        backgroundColor: "#f8fafc",
        borderColor: "#cbd5e1",
    },
    errorMessage: {
        backgroundColor: "#fef2f2",
        color: "#dc2626",
        border: "1px solid #fecaca",
        marginTop: "16px",
        padding: "12px 16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    loadingSpinner: {
        width: "16px",
        height: "16px",
        border: "2px solid #e2e8f0",
        borderTop: "2px solid #2563eb",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
    fileInputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        marginBottom: "16px",
    },
    fileInputLabel: {
        fontSize: "14px",
        fontWeight: 500,
        color: "#1e293b",
        marginBottom: "8px",
    },
    fileInputField: {
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
        color: "#1e293b",
        backgroundColor: "white",
        outline: "none",
        boxSizing: "border-box" as "border-box",
    },
};

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
        <>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div style={styles.modalOverlay}>
                <div style={styles.modalContent}>
                    <button
                        onClick={onCancel}
                        style={styles.modalCloseButton}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                                styles.modalCloseButtonHover.backgroundColor;
                            e.currentTarget.style.color = styles.modalCloseButtonHover.color;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = styles.modalCloseButton.color;
                        }}
                    >
                        <X size={24} />
                    </button>
                    <h4 style={styles.modalTitle}>Add New Product</h4>
                    <form onSubmit={onSave}>
                        <div style={styles.formGrid}>
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
                                value={formData.productShelfNumber}
                                onChange={onInputChange}
                                placeholder="e.g., 5"
                                required
                            />
                            <FormField
                                label="Row Number"
                                name="productRowNumber"
                                type="number"
                                value={formData.productRowNumber}
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
                                value={formData.productWeight}
                                onChange={onInputChange}
                                placeholder="e.g., 1.5"
                                required
                            />
                            <div style={styles.fileInputContainer}>
                                <label htmlFor="productImageFile" style={styles.fileInputLabel}>
                                    Product Image
                                </label>
                                <input
                                    id="productImageFile"
                                    name="productImageFile"
                                    type="file"
                                    onChange={onFileChange}
                                    accept="image/*"
                                    style={styles.fileInputField}
                                />
                            </div>
                        </div>
                        {error && <div style={styles.errorMessage}>{error}</div>}
                        <div style={styles.formActions}>
                            <button
                                type="button"
                                onClick={onCancel}
                                style={styles.secondaryButton}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        styles.secondaryButtonHover.backgroundColor;
                                    e.currentTarget.style.borderColor =
                                        styles.secondaryButtonHover.borderColor;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "white";
                                    e.currentTarget.style.borderColor = "#e2e8f0";
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={styles.primaryButton}
                                disabled={loading}
                                onMouseEnter={(e) => {
                                    if (!loading)
                                        e.currentTarget.style.backgroundColor =
                                            styles.primaryButtonHover.backgroundColor;
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading)
                                        e.currentTarget.style.backgroundColor = "#2563eb";
                                }}
                            >
                                {loading ? (
                                    <>
                                        <div style={styles.loadingSpinner}></div>
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
        </>
    );
};

export default AddProductModal;
