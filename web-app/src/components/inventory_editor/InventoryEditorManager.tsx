import { useCallback, useEffect, useState } from "react";
import Item from "./Item";
import { inventoryService } from "../../hooks/services/inventoryService";
import { useItemContext } from "../../hooks/context/useItemContext";
import AddProductModal from "../models/AddProductModal";
import ConfirmationModal from "../models/ConfirmationModal";
import UpdateProductModal from "../models/UpdateProductModal";
import {
  productService,
  AddProductPayload,
  UpdateProductPayload,
} from "../../hooks/services/productService";
import { Product, ProductFormState } from "../../types/Item";

const InventoryEditorManager = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleFetchAllProducts();
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [currentProductBarcode, setCurrentProductBarcode] = useState<
    string | null
  >(null);

  const defaultFormState: ProductFormState = {
    productName: "",
    productDescription: "",
    productPrice: "",
    productQuantity: "",
    productCategory: "",
    productShelfNumber: "",
    productRowNumber: "",
    productBrand: "",
    productWeight: "",
    productImageFile: undefined,
  };
  const [formData, setFormData] = useState<ProductFormState>(defaultFormState);

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [productToDeleteBarcode, setProductToDeleteBarcode] = useState<
    string | null
  >(null);

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
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFormData((prev) => ({
          ...prev,
          productImageFile: e.target.files![0],
        }));
      } else {
        setFormData((prev) => ({ ...prev, productImageFile: undefined }));
      }
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormData(defaultFormState);
    setMessage(null);
    setError(null);
  }, []);

  const validateProductForm = useCallback(() => {
    if (
      !formData.productName ||
      !formData.productDescription ||
      !formData.productPrice ||
      !formData.productQuantity ||
      !formData.productCategory ||
      !formData.productShelfNumber ||
      !formData.productRowNumber ||
      !formData.productBrand ||
      !formData.productWeight
    ) {
      setError("All fields are required.");
      return false;
    }
    if (
      isNaN(Number(formData.productPrice)) ||
      Number(formData.productPrice) <= 0
    ) {
      setError("Product Price must be a positive number.");
      return false;
    }
    if (
      isNaN(Number(formData.productQuantity)) ||
      !Number.isInteger(Number(formData.productQuantity)) ||
      Number(formData.productQuantity) < 0
    ) {
      setError("Product Quantity must be a non-negative integer.");
      return false;
    }
    if (
      isNaN(Number(formData.productShelfNumber)) ||
      !Number.isInteger(Number(formData.productShelfNumber)) ||
      Number(formData.productShelfNumber) <= 0
    ) {
      setError("Product Shelf Number must be a positive integer.");
      return false;
    }
    if (
      isNaN(Number(formData.productRowNumber)) ||
      !Number.isInteger(Number(formData.productRowNumber)) ||
      Number(formData.productRowNumber) <= 0
    ) {
      setError("Product Row Number must be a positive integer.");
      return false;
    }
    if (
      isNaN(Number(formData.productWeight)) ||
      Number(formData.productWeight) <= 0
    ) {
      setError("Product Weight must be a positive number.");
      return false;
    }
    setError(null);
    return true;
  }, [formData]);

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
          productPrice: Number(formData.productPrice),
          productQuantity: Number(formData.productQuantity),
          productCategory: formData.productCategory,
          productShelfNumber: Number(formData.productShelfNumber),
          productRowNumber: Number(formData.productRowNumber),
          productBrand: formData.productBrand,
          productWeight: Number(formData.productWeight),
        };
        const successMessage = await productService.addProduct(
          payload,
          formData.productImageFile
        );
        setMessage(successMessage);
        resetForm();
        setShowAddForm(false);
        handleFetchAllProducts();
      } catch (err: any) {
        console.error("Error adding product:", err);
        setError(err.response?.data?.message || "Failed to add product.");
      } finally {
        setLoading(false);
      }
    },
    [formData, validateProductForm, resetForm, handleFetchAllProducts]
  );

  const handleUpdateSubmit = useCallback(
    async (e: React.FormEvent) => {
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
        const successMessage = await productService.updateProduct(
          payload,
          formData.productImageFile
        );
        setMessage(successMessage);
        resetForm();
        setShowUpdateForm(false);
        setCurrentProductBarcode(null);
        handleFetchAllProducts();
      } catch (err: any) {
        console.error("Error updating product:", err);
        setError(err.response?.data?.message || "Failed to update product.");
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      validateProductForm,
      currentProductBarcode,
      resetForm,
      handleFetchAllProducts,
    ]
  );

  const handleEditClick = useCallback((product: Product) => {
    setFormData({
      barcode: product.barcode || "",
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
      const successMessage = await productService.deleteProduct(
        productToDeleteBarcode
      );
      setMessage(successMessage);
      setProductToDeleteBarcode(null);
      handleFetchAllProducts();
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setError(err.response?.data?.message || "Failed to delete product.");
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
          {products.map((item) => (
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
            />
          ))}
        </div>

        {products.length === 0 && (
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
                  onClick={handleFetchAllProducts}
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
        currentProduct={products.find(
          (p) => p.barcode === currentProductBarcode
        )}
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
  );
};

export default InventoryEditorManager;
