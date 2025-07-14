import React, { useState, useEffect } from "react";
import { Trash2, Edit } from "lucide-react"; // Import Edit icon
import { ItemProps, Product } from "../../types/Item";
import styles from "./Item.module.css";

const Item: React.FC<ItemProps> = ({
  barcode,
  productName,
  productCategory,
  productBrand,
  productPrice,
  productQuantity,
  productShelfNumber,
  productDescription,
  productRowNumber,
  productWeight,
  productImage,
  removeItem,
  updateItem,
}) => {
  const [hovered, setHovered] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("https://thumbs.dreamstime.com/b/art-illustration-317105366.jpg");

  useEffect(() => {
    if (productImage instanceof File) {
      const imageUrl = URL.createObjectURL(productImage);
      setImageSrc(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    } else if (typeof productImage === 'string' && productImage.startsWith('http')) {
      setImageSrc(productImage);
    }
  }, [productImage]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    const updatedProduct: Product = {
      barcode,
      productName: productName || '',
      productCategory,
      productBrand,
      productPrice,
      productQuantity: newQuantity,
      productShelfNumber,
      productDescription,
      productRowNumber: Number(productRowNumber),
      productWeight: Number(productWeight),
      productImage: productImage,
    };
    updateItem(updatedProduct);
  };

  const handleEditClick = () => {
    // When the edit button is clicked, we'll trigger an update.
    // For a full "edit" functionality, you might open a modal or navigate
    // to an edit page, passing the current product data.
    // For this example, we'll just trigger updateItem with current data.
    // In a real scenario, you'd likely have a form to collect updated data.
    const productToEdit: Product = {
      barcode,
      productName: productName || '',
      productCategory,
      productBrand,
      productPrice,
      productQuantity,
      productShelfNumber,
      productDescription,
      productRowNumber: Number(productRowNumber),
      productWeight: Number(productWeight),
      productImage: productImage,
    };
    updateItem(productToEdit); // This will effectively "save" current state or prompt an edit
  };

  return (
    <div
      className={`${styles.card} ${hovered ? styles.cardHovered : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.header}>
        <h3 className={styles.title} title={productName}>
          {productName}
        </h3>
        <div className={styles.actionButtons}>
          <button
            onClick={handleEditClick}
            title="Edit item"
            className={styles.editButton}
          >
            <Edit size={16} color="currentColor" strokeWidth={2} />
          </button>
          <button
            onClick={() => removeItem(barcode)}
            title="Delete item"
            className={styles.deleteButton}
          >
            <Trash2 size={16} color="currentColor" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className={styles.imageWrapper}>
        <img
          src={imageSrc}
          alt={productName || "Product image"}
          className={styles.image}
          onError={(e) => {
            const fallback = "https://thumbs.dreamstime.com/b/art-illustration-317105366.jpg";
            if ((e.target as HTMLImageElement).src !== fallback) {
              (e.target as HTMLImageElement).src = fallback;
            }
          }}
        />

        {hovered && (
          <div className={styles.imageOverlay}>
            <p className={styles.descriptionOverlay}>{productDescription}</p>
          </div>
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.tagGroup}>
          {productCategory && (
            <span className={styles.tag}>Category: {productCategory}</span>
          )}
          {productBrand && (
            <span className={styles.tag}>Brand: {productBrand}</span>
          )}
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Price:</span>
            <span className={styles.value}>Rs. {productPrice?.toFixed(2)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Barcode:</span>
            <span className={styles.value}>{barcode}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Location:</span>
            <span className={styles.value}>Shelf {productShelfNumber}, Row {productRowNumber}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Weight:</span>
            <span className={styles.value}>{productWeight} kg</span>
          </div>
        </div>

        <div className={styles.quantityControl}>
          <label htmlFor={`quantity-${barcode}`} className={styles.quantityLabel}>Quantity:</label>
          <span className={styles.value}>{productQuantity}</span>
        </div>
      </div>
    </div>
  );
};

export default Item;