import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, RefreshCw, Package } from 'lucide-react';
import { productService, AddProductPayload, UpdateProductPayload } from '../../hooks/services/productService';
import ConfirmationModal from '../models/ConfirmationModal';
import AddProductModal from '../models/AddProductModal';
import UpdateProductModal from '../models/UpdateProductModal';
import { Product } from '../../types/Item';

// Define ProductFormState to manage form inputs, including the File object
interface ProductFormState {
    barcode?: string; // For update operations
    productName: string;
    productDescription: string;
    productPrice: string; // Stored as string from input, converted to number for API
    productQuantity: string; // Stored as string from input, converted to number for API
    productCategory: string;
    productShelfNumber: string; // Stored as string from input, converted to number for API
    productRowNumber: string; // Stored as string from input, converted to number for API
    productBrand: string;
    productWeight: string; // Stored as string from input, converted to number for API
    productImageFile?: File; // For the actual file input
}

export const ProductManagementSection: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
    const [currentProductBarcode, setCurrentProductBarcode] = useState<string | null>(null);

    const defaultFormState: ProductFormState = {
        productName: '',
        productDescription: '',
        productPrice: '',
        productQuantity: '',
        productCategory: '',
        productShelfNumber: '',
        productRowNumber: '',
        productBrand: '',
        productWeight: '',
        productImageFile: undefined,
    };
    const [formData, setFormData] = useState<ProductFormState>(defaultFormState);

    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [productToDeleteBarcode, setProductToDeleteBarcode] = useState<string | null>(null);

    // Static options for categories and brands for the select fields
    const productCategoryOptions = [
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Apparel', label: 'Apparel' },
        { value: 'Home Goods', label: 'Home Goods' },
        { value: 'Food', label: 'Food' },
        { value: 'Books', label: 'Books' },
        { value: 'Beauty', label: 'Beauty' },
    ];

    const productBrandOptions = [
        { value: 'BrandA', label: 'BrandA' },
        { value: 'BrandB', label: 'BrandB' },
        { value: 'BrandC', label: 'BrandC' },
        { value: 'BrandD', label: 'BrandD' },
    ];

    // Fetch all products on component mount
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
        } catch (err: any) {
            console.error('Error fetching products:', err);
            setError(err.response?.data?.message || 'Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, productImageFile: e.target.files![0] }));
        } else {
            setFormData(prev => ({ ...prev, productImageFile: undefined }));
        }
    }, []);

    const resetForm = useCallback(() => {
        setFormData(defaultFormState);
        setMessage(null);
        setError(null);
    }, []);

    const validateProductForm = useCallback(() => {
        if (!formData.productName || !formData.productDescription || !formData.productPrice ||
            !formData.productQuantity || !formData.productCategory || !formData.productShelfNumber ||
            !formData.productRowNumber || !formData.productBrand || !formData.productWeight) {
            setError('All fields are required.');
            return false;
        }
        if (isNaN(Number(formData.productPrice)) || Number(formData.productPrice) <= 0) {
            setError('Product Price must be a positive number.');
            return false;
        }
        if (isNaN(Number(formData.productQuantity)) || !Number.isInteger(Number(formData.productQuantity)) || Number(formData.productQuantity) < 0) {
            setError('Product Quantity must be a non-negative integer.');
            return false;
        }
        if (isNaN(Number(formData.productShelfNumber)) || !Number.isInteger(Number(formData.productShelfNumber)) || Number(formData.productShelfNumber) <= 0) {
            setError('Product Shelf Number must be a positive integer.');
            return false;
        }
        if (isNaN(Number(formData.productRowNumber)) || !Number.isInteger(Number(formData.productRowNumber)) || Number(formData.productRowNumber) <= 0) {
            setError('Product Row Number must be a positive integer.');
            return false;
        }
        if (isNaN(Number(formData.productWeight)) || Number(formData.productWeight) <= 0) {
            setError('Product Weight must be a positive number.');
            return false;
        }
        setError(null);
        return true;
    }, [formData]);

    const handleAddSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateProductForm()) return;

        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const payload: AddProductPayload = {
                productName: formData.productName,
                productDescription: formData.productDescription,
                productPrice: Number(formData.productPrice),
                productQuantity: Number(formData.productQuantity),
                productCategory: formData.productCategory,
                productShelfNumber: Number(formData.productShelfNumber),
                productRowNumber: Number(formData.productRowNumber),
                productBrand: formData.productBrand,
                productWeight: Number(formData.productWeight),
            };
            const successMessage = await productService.addProduct(payload, formData.productImageFile);
            setMessage(successMessage);
            resetForm();
            setShowAddForm(false);
            handleFetchAllProducts();
        } catch (err: any) {
            console.error('Error adding product:', err);
            setError(err.response?.data?.message || 'Failed to add product.');
        } finally {
            setLoading(false);
        }
    }, [formData, validateProductForm, resetForm, handleFetchAllProducts]);

    const handleUpdateSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateProductForm() || !currentProductBarcode) return;

        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const payload: UpdateProductPayload = {
                barcode: currentProductBarcode,
                productName: formData.productName,
                productDescription: formData.productDescription,
                productPrice: Number(formData.productPrice),
                productQuantity: Number(formData.productQuantity),
                productCategory: formData.productCategory,
                productShelfNumber: Number(formData.productShelfNumber),
                productRowNumber: Number(formData.productRowNumber),
                productBrand: formData.productBrand,
                productWeight: Number(formData.productWeight),
            };
            const successMessage = await productService.updateProduct(payload, formData.productImageFile);
            setMessage(successMessage);
            resetForm();
            setShowUpdateForm(false);
            setCurrentProductBarcode(null);
            handleFetchAllProducts();
        } catch (err: any) {
            console.error('Error updating product:', err);
            setError(err.response?.data?.message || 'Failed to update product.');
        } finally {
            setLoading(false);
        }
    }, [formData, validateProductForm, currentProductBarcode, resetForm, handleFetchAllProducts]);

    const handleEditClick = useCallback((product: Product) => {
        setFormData({
            barcode: product.barcode || '',
            productName: product.productName,
            productDescription: product.productDescription,
            productPrice: product.productPrice.toString(),
            productQuantity: product.productQuantity.toString(),
            productCategory: product.productCategory,
            productShelfNumber: product.productShelfNumber.toString(),
            productRowNumber: product.productRowNumber.toString(),
            productBrand: product.productBrand,
            productWeight: product.productWeight.toString(),
            productImageFile: undefined,
        });
        setCurrentProductBarcode(product.barcode || null);
        setShowUpdateForm(true);
        setMessage(null);
        setError(null);
    }, []);

    const handleDeleteClick = useCallback((barcode: string) => {
        setProductToDeleteBarcode(barcode);
        setShowConfirmModal(true);
        setMessage(null);
        setError(null);
    }, []);

    const confirmDeleteProduct = useCallback(async () => {
        setShowConfirmModal(false);
        if (!productToDeleteBarcode) return;

        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const successMessage = await productService.deleteProduct(productToDeleteBarcode);
            setMessage(successMessage);
            setProductToDeleteBarcode(null);
            handleFetchAllProducts();
        } catch (err: any) {
            console.error('Error deleting product:', err);
            setError(err.response?.data?.message || 'Failed to delete product.');
        } finally {
            setLoading(false);
        }
    }, [productToDeleteBarcode, handleFetchAllProducts]);

    const handleCancelAdd = useCallback(() => {
        setShowAddForm(false);
        resetForm();
    }, [resetForm]);

    const handleCancelEdit = useCallback(() => {
        setShowUpdateForm(false);
        setCurrentProductBarcode(null);
        resetForm();
    }, [resetForm]);

    const styles = {
        container: {
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            fontFamily: 'Inter, system-ui, sans-serif',
            border: '1px solid #f1f5f9',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '1px solid #f1f5f9',
        },
        titleContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
        },
        iconContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#eff6ff',
        },
        title: {
            fontSize: '24px',
            fontWeight: 600,
            color: '#1e293b',
            margin: 0,
        },
        subtitle: {
            fontSize: '14px',
            color: '#64748b',
            marginTop: '4px',
        },
        actionButtonsContainer: {
            display: 'flex',
            gap: '12px',
        },
        primaryButton: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '8px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        },
        secondaryButton: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            color: '#475569',
            gap: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.2s ease',
        },
        tableContainer: {
            overflowX: 'auto' as 'auto',
            marginTop: '24px',
            border: '1px solid #f1f5f9',
            borderRadius: '12px',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse' as 'collapse',
            minWidth: '800px',
        },
        th: {
            backgroundColor: '#f8fafc',
            padding: '16px',
            textAlign: 'left' as 'left',
            fontSize: '12px',
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase' as 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '1px solid #f1f5f9',
        },
        td: {
            padding: '16px',
            fontSize: '14px',
            color: '#1e293b',
            borderBottom: '1px solid #f1f5f9',
        },
        tableActions: {
            display: 'flex',
            gap: '8px',
        },
        editButton: {
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
        },
        deleteButton: {
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
        },
        messageBox: {
            marginTop: '24px',
            padding: '16px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        successMessage: {
            backgroundColor: '#dcfce7',
            color: '#166534',
            border: '1px solid #bbf7d0',
        },
        errorMessage: {
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
        },
        emptyState: {
            textAlign: 'center' as 'center',
            padding: '48px 24px',
            color: '#64748b',
        },
        emptyStateTitle: {
            fontSize: '18px',
            fontWeight: 600,
            color: '#475569',
            marginBottom: '8px',
        },
        emptyStateDescription: {
            fontSize: '14px',
            color: '#64748b',
        },
        loadingSpinner: {
            width: '16px',
            height: '16px',
            border: '2px solid #e2e8f0',
            borderTop: '2px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
        },
    };

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
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.titleContainer}>
                        <div style={styles.iconContainer}>
                            <Package size={24} color="#2563eb" />
                        </div>
                        <div>
                            <h3 style={styles.title}>Product Management</h3>
                            <p style={styles.subtitle}>Manage your inventory and product catalog</p>
                        </div>
                    </div>
                    <div style={styles.actionButtonsContainer}>
                        <button
                            onClick={() => { setShowAddForm(true); resetForm(); }}
                            style={styles.primaryButton}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#1d4ed8';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#2563eb';
                            }}
                        >
                            <Plus size={16} />
                            Add Product
                        </button>
                        <button
                            onClick={handleFetchAllProducts}
                            disabled={loading}
                            style={styles.secondaryButton}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.backgroundColor = '#f8fafc';
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={styles.loadingSpinner}></div>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={16} />
                                    Refresh
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Product List Table */}
                {products.length === 0 && !loading ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyStateTitle}>No Products Found</div>
                        <div style={styles.emptyStateDescription}>
                            Add your first product to get started with inventory management
                        </div>
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Barcode</th>
                                    <th style={styles.th}>Product Name</th>
                                    <th style={styles.th}>Category</th>
                                    <th style={styles.th}>Brand</th>
                                    <th style={styles.th}>Price</th>
                                    <th style={styles.th}>Quantity</th>
                                    <th style={styles.th}>Location</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.barcode}>
                                        <td style={styles.td}>{product.barcode}</td>
                                        <td style={styles.td}>{product.productName}</td>
                                        <td style={styles.td}>{product.productCategory}</td>
                                        <td style={styles.td}>{product.productBrand}</td>
                                        <td style={styles.td}>${product.productPrice.toFixed(2)}</td>
                                        <td style={styles.td}>{product.productQuantity}</td>
                                        <td style={styles.td}>S{product.productShelfNumber}/R{product.productRowNumber}</td>
                                        <td style={styles.td}>
                                            <div style={styles.tableActions}>
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    style={styles.editButton}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#15803d';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#16a34a';
                                                    }}
                                                >
                                                    <Edit size={14} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(product.barcode!)}
                                                    style={styles.deleteButton}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#b91c1c';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#dc2626';
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Message Box */}
                {(message || error) && (
                    <div
                        style={{
                            ...styles.messageBox,
                            ...(message ? styles.successMessage : styles.errorMessage),
                        }}
                    >
                        {message || error}
                    </div>
                )}

                {/* Add Product Modal */}
                <AddProductModal
                    isOpen={showAddForm}
                    formData={formData}
                    loading={loading}
                    error={error}
                    onSave={handleAddSubmit}
                    onCancel={handleCancelAdd}
                    onInputChange={handleInputChange}
                    onFileChange={handleFileChange}
                />

                {/* Edit Product Modal */}
                <UpdateProductModal
                    isOpen={showUpdateForm}
                    formData={formData}
                    loading={loading}
                    error={error}
                    currentProduct={products.find(p => p.barcode === currentProductBarcode)}
                    onSave={handleUpdateSubmit}
                    onCancel={handleCancelEdit}
                    onInputChange={handleInputChange}
                    onFileChange={handleFileChange}
                />

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showConfirmModal}
                    title="Delete Product"
                    message={`Are you sure you want to delete the product with barcode: ${productToDeleteBarcode}? This action cannot be undone.`}
                    confirmText="Delete Product"
                    cancelText="Cancel"
                    onConfirm={confirmDeleteProduct}
                    onCancel={() => setShowConfirmModal(false)}
                    isDestructive={true}
                />
            </div>
        </>
    );
};