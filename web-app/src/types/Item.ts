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
    productDescription: string;
    productRowNumber: number; // Stored as string from input, converted to number for API
    productWeight: number; // Stored as string from input, converted to number for API
    productImage?: File | string;
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
    productShelfNumber: number; // Stored as string from input, converted to number for API
    productRowNumber: number; // Stored as string from input, converted to number for API
    productBrand: string;
    productWeight: number; // Stored as string from input, converted to number for API
    productImage?: File | string;
}

export const defaultFormState: ProductFormState = {
    productName: "",
    productDescription: "",
    productPrice: "",
    productQuantity: "",
    productCategory: "",
    productShelfNumber: 0,
    productRowNumber: 0,
    productBrand: "",
    productWeight: 0,
    productImage: undefined,
  };

export interface CartItem {
    name: string;
    price: number;
    quantity: number;
    weight: number; // in grams
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
    productImage?: File | string;
    productShelfNumber: number;
    productRowNumber: number;
    productBrand: string;
    productWeight: number;
}

export const sampleProducts: Product[] = [
  {
    barcode: "P001-A1B2C3D4",
    productName: "Organic Coffee Beans (Dark Roast)",
    productDescription: "Premium dark roast coffee beans, ethically sourced and organically grown. Perfect for espresso or drip coffee.",
    productPrice: 12.99,
    productQuantity: 150,
    productCategory: "Beverages",
    productImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd", // Coffee beans
    productShelfNumber: 1,
    productRowNumber: 5,
    productBrand: "Bean Bliss Organics",
    productWeight: 0.5
  },
  {
    barcode: "P002-E5F6G7H8",
    productName: "Smart LED TV 55-inch",
    productDescription: "55-inch 4K UHD Smart LED TV with HDR support, built-in streaming apps, and voice control.",
    productPrice: 499.99,
    productQuantity: 25,
    productCategory: "Electronics",
    productImage: "https://images.unsplash.com/photo-1606813908983-bf06a0f556f7", // Smart TV
    productShelfNumber: 3,
    productRowNumber: 2,
    productBrand: "ElectroVision",
    productWeight: 15.2
  },
  {
    barcode: "P003-I9J0K1L2",
    productName: "Yoga Mat (Eco-Friendly)",
    productDescription: "Non-slip, eco-friendly yoga mat made from natural rubber. 6mm thick for comfortable practice.",
    productPrice: 29.50,
    productQuantity: 80,
    productCategory: "Fitness & Sports",
    productImage: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1", // Yoga mat
    productShelfNumber: 2,
    productRowNumber: 1,
    productBrand: "GreenStride Gear",
    productWeight: 1.2
  },
  {
    barcode: "P004-M3N4O5P6",
    productName: "Wireless Bluetooth Headphones",
    productDescription: "Over-ear wireless headphones with noise cancellation and 30-hour battery life. Deep bass and clear highs.",
    productPrice: 75.00,
    productQuantity: 100,
    productCategory: "Electronics",
    productImage: "https://images.unsplash.com/photo-1585386959984-a41552256f47", // Headphones
    productShelfNumber: 3,
    productRowNumber: 4,
    productBrand: "SonicWave Audio",
    productWeight: 0.25
  },
  {
    barcode: "P005-Q7R8S9T0",
    productName: "Stainless Steel Water Bottle",
    productDescription: "500ml double-walled, vacuum-insulated stainless steel water bottle. Keeps drinks cold for 24 hours.",
    productPrice: 19.95,
    productQuantity: 200,
    productCategory: "Kitchenware",
    productImage: "https://images.unsplash.com/photo-1601047021051-76b5e8984c66", // Water bottle
    productShelfNumber: 1,
    productRowNumber: 10,
    productBrand: "HydroFlow Essentials",
    productWeight: 0.3
  },
  {
    barcode: "P006-U1V2W3X4",
    productName: "Gardening Tool Set (5-Piece)",
    productDescription: "Essential 5-piece gardening tool set including trowel, transplanter, cultivator, weeder, and pruning shears.",
    productPrice: 35.00,
    productQuantity: 40,
    productCategory: "Home & Garden",
    productImage: "https://images.unsplash.com/photo-1585325701954-fd0868f27f8e", // Gardening tools
    productShelfNumber: 4,
    productRowNumber: 3,
    productBrand: "GreenThumb Tools",
    productWeight: 1.8
  },
  {
    barcode: "P007-Y5Z6A7B8",
    productName: "Classic Denim Jeans (Men's)",
    productDescription: "Comfort fit, classic blue denim jeans for men. Durable and stylish for everyday wear.",
    productPrice: 55.00,
    productQuantity: 70,
    productCategory: "Apparel",
    productImage: "https://images.unsplash.com/photo-1562158076-374213e6f939", // Denim jeans
    productShelfNumber: 5,
    productRowNumber: 1,
    productBrand: "TrueFit Denim",
    productWeight: 0.7
  },
  {
    barcode: "P008-C9D0E1F2",
    productName: "Laptop Backpack (Waterproof)",
    productDescription: "Spacious and durable waterproof laptop backpack with multiple compartments for 15.6-inch laptops.",
    productPrice: 45.00,
    productQuantity: 60,
    productCategory: "Bags & Luggage",
    productImage: "https://images.unsplash.com/photo-1593111224453-e458b7c9be30", // Backpack
    productShelfNumber: 5,
    productRowNumber: 5,
    productBrand: "UrbanCarry Gear",
    productWeight: 0.9
  },
  {
    barcode: "P009-G3H4I5J6",
    productName: "Art Drawing Kit (Deluxe)",
    productDescription: "Comprehensive drawing kit with pencils, charcoal, pastels, sketchpad, and erasers. Ideal for artists.",
    productPrice: 60.00,
    productQuantity: 30,
    productCategory: "Arts & Crafts",
    productImage: "https://images.unsplash.com/photo-1582560475006-afea79b6cb4b", // Art supplies
    productShelfNumber: 4,
    productRowNumber: 1,
    productBrand: "CreativeFlow Art",
    productWeight: 1.5
  },
  {
    barcode: "P010-K7L8M9N0",
    productName: "Bluetooth Smart Scale",
    productDescription: "Smart body composition scale with Bluetooth connectivity to track weight, BMI, body fat, and more.",
    productPrice: 39.99,
    productQuantity: 90,
    productCategory: "Health & Personal Care",
    productImage: "https://images.unsplash.com/photo-1588776814546-3f1fefb34f2e", // Smart scale
    productShelfNumber: 2,
    productRowNumber: 7,
    productBrand: "FitMeasure Tech",
    productWeight: 1.0
  }
];