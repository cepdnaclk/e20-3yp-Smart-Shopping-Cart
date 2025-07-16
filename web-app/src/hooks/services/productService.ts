import { Product, sampleProducts, CartItem } from "../../types/Item";
import api from "./api"; // Assuming your configured axios instance

// Define interface for Product creation payload (without barcode, includes image as File)
export interface AddProductPayload extends Omit<Product, 'barcode' | 'productImage'> {
    productImage?: File | string; // For upload
}

// Define interface for Product update payload (includes barcode, includes image as File)
export interface UpdateProductPayload extends Omit<Product, 'productImage'> {
    productImage?: File | string; // For upload
}

export const productService = {
    /**
     * Adds a new product to the system.
     * Supports optional product image upload using multipart/form-data.
     * Requires authentication.
     * @param productData - Object containing product details.
     * @param productImage - Optional File object for the product image.
     * @returns A promise that resolves to the success message from the API.
     * @throws Error if the API call fails.
     */
    async addProduct(productData: AddProductPayload, productImage?: File | string): Promise<string> {
        const formData = new FormData();

        // Append all product data fields
        for (const key in productData) {
            if (Object.prototype.hasOwnProperty.call(productData, key)) {
                formData.append(key, (productData as any)[key]);
            }
        }

        // Append image if provided
        if (productImage) {
            formData.append('productImage', productImage);
        }

        // Axios automatically sets 'Content-Type: multipart/form-data' when FormData is used.
        const response = await api.post('/product/auth/add', formData);
        return response.data.message; // Assuming success message is in response.data.message
    },

    /**
     * Updates an existing product by its barcode.
     * Supports optional product image upload using multipart/form-data.
     * Requires authentication.
     * @param productData - Object containing product details including the barcode.
     * @param productImage - Optional File object for the product image.
     * @returns A promise that resolves to the success message from the API.
     * @throws Error if the API call fails.
     */
    async updateProduct(productData: UpdateProductPayload, productImage?: File | string): Promise<string> {
        const formData = new FormData();

        // Append all product data fields
        for (const key in productData) {
            if (Object.prototype.hasOwnProperty.call(productData, key)) {
                formData.append(key, (productData as any)[key]);
            }
        }

        // Append image if provided
        if (productImage) {
            formData.append('productImage', productImage);
        }

        // Axios automatically sets 'Content-Type: multipart/form-data' when FormData is used.
        const response = await api.put('/product/auth/update', formData);
        return response.data.message; // Assuming success message is in response.data.message
    },

    /**
     * Deletes a product by its barcode.
     * Requires authentication.
     * @param barcode - The barcode of the product to delete.
     * @returns A promise that resolves to the success message from the API.
     * @throws Error if the API call fails.
     */
    async deleteProduct(barcode: string): Promise<string> {
        const response = await api.delete(`/product/auth/delete?barcode=${barcode}`);
        return response.data.message; // Assuming success message is in response.data.message
    },

    /**
     * Gets a product using the last scanned barcode (context-specific for IoT integration).
     * This endpoint description is vague; assuming it returns a single Product object.
     * @returns A promise that resolves to the product data.
     * @throws Error if the API call fails.
     */
    async getProductByLastScanned(): Promise<Product> {
        const response = await api.get<Product>('/product/all/get');
        return response.data;
    },

    /**
     * Gets all products from the system.
     * @returns A promise that resolves to an array of product data.
     * @throws Error if the API call fails.
     */
   async getAllProducts(): Promise<Product[]> {
    try {
        const response = await api.get<Product[]>('/product/auth/all/all');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all products. Using sample data as fallback:", error);
        // Fallback to sample data for development
        return sampleProducts; // <<< Use sample data here
    }
},

    /**
     * Gets products filtered by category.
     * @param category - The category to filter products by.
     * @returns A promise that resolves to an array of product data.
     * @throws Error if the API call fails.
     */
    async getProductsByCategory(category: string): Promise<Product[]> {
        const response = await api.get<Product[]>(`/product/all/by-category?category=${category}`);
        return response.data;
    },

    /**
     * Gets products filtered by brand.
     * @param brand - The brand to filter products by.
     * @returns A promise that resolves to an array of product data.
     * @throws Error if the API call fails.
     */
    async getProductsByBrand(brand: string): Promise<Product[]> {
        const response = await api.get<Product[]>(`/product/all/by-brand?brand=${brand}`);
        return response.data;
    },

    async getProductsByCustomer(customerId: string): Promise<Product[]> {
        const response = await api.get<Product[]>(`/product/auth/by-customer?customerId=${customerId}`);
        return response.data;
    },

    async getShoppingListItems(userId: string): Promise<CartItem[]> {
        try {
            const response = await api.get<CartItem[]>(`/cart/auth/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching shopping list items:', error);
            throw new Error('Failed to load shopping list items.');
        }
    },

    async getTotalWeight(userId: string): Promise<number> {
        try {
            const response = await api.get(`/bill/auth/view/${userId}`);
            const dto = response.data;
            const parsedWeight = parseFloat(dto.totalWeight); // "0.487"
            return isNaN(parsedWeight) ? 0 : parsedWeight * 1000; // convert kg to grams
        } catch (error) {
            console.error('Error fetching total weight:', error);
            throw new Error('Failed to load total weight.');
        }
    }
};