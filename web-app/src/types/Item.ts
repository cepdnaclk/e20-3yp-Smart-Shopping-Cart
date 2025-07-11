/**
 * Item represents a product placed in the Item Map
 * Includes position metadata for grid system
 */


export type Item = {
  id: string; // Unique ID of the item
  name: string; // Name of the item
  row: number; // Row index in the grid (0-based)
  col: number; // Column index in the grid (0-based)
  index: number; // Index within a cell (0-based) which defines the order of items from left to right
};

export type InventoryItem = {
  _id: string;
  name: string;
  imageUrl: string;
  count: number;
}

export type ItemProps = {
    barcode: string;
    removeItem: (barcode: string) => void;
    updateItem: (product: Product) => void;
    productName: string | undefined;
    productCategory: string;
    productBrand: string;
    productPrice: number;
    productQuantity: number;
    productShelfNumber: number;
}

export type ItemContainerProps = {
  rows?: number;
  cols?: number;
  edge: string;
}

// Define ProductFormState to manage form inputs, including the File object
export interface ProductFormState {
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

// Define interfaces for Product data
// These should ideally come from a shared types file (e.g., ../types/Product.ts)
export interface Product {
    barcode: string; // Barcode is generated on add, required for update/delete
    productName: string;
    productDescription: string;
    productPrice: number;
    productQuantity: number;
    productCategory: string;
    productImage?: File | string; // File for upload, string for URL/path when fetched
    productShelfNumber: number;
    productRowNumber: number;
    productBrand: string;
    productWeight: number;
}

