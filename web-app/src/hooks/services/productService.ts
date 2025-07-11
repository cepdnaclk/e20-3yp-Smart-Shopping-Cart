import { Product } from "../../types/Item";
import api from "./api"; // Assuming your configured axios instance

// Define interface for Product creation payload (without barcode, includes image as File)
export interface AddProductPayload extends Omit<Product, 'barcode' | 'productImage'> {
    productImage?: File; // For upload
}

// Define interface for Product update payload (includes barcode, includes image as File)
export interface UpdateProductPayload extends Omit<Product, 'productImage'> {
    productImage?: File; // For upload
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
    async addProduct(productData: AddProductPayload, productImage?: File): Promise<string> {
        // Check for tokens before making request
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (!accessToken || !refreshToken) {
            throw new Error('Authentication tokens missing. Please log in again.');
        }

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
    async updateProduct(productData: UpdateProductPayload, productImage?: File): Promise<string> {
        // Check for tokens before making request
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (!accessToken || !refreshToken) {
            throw new Error('Authentication tokens missing. Please log in again.');
        }

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
        // Check for tokens before making request
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (!accessToken || !refreshToken) {
            throw new Error('Authentication tokens missing. Please log in again.');
        }

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
        // Check for tokens before making request
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (!accessToken || !refreshToken) {
            throw new Error('Authentication tokens missing. Please log in again.');
        }

        const response = await api.get<Product>('/product/all/get');
        return response.data;
    },

    /**
     * Gets all products from the system.
     * @returns A promise that resolves to an array of product data.
     * @throws Error if the API call fails.
     */
    async getAllProducts(): Promise<Product[]> {
        // Check for tokens before making request
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (!accessToken || !refreshToken) {
            throw new Error('Authentication tokens missing. Please log in again.');
        }

        const response = await api.get<Product[]>('/product/all/all');
        return response.data;
    },

    /**
     * Gets products filtered by category.
     * @param category - The category to filter products by.
     * @returns A promise that resolves to an array of product data.
     * @throws Error if the API call fails.
     */
    async getProductsByCategory(category: string): Promise<Product[]> {
        // Check for tokens before making request
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (!accessToken || !refreshToken) {
            throw new Error('Authentication tokens missing. Please log in again.');
        }

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
        // Check for tokens before making request
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (!accessToken || !refreshToken) {
            throw new Error('Authentication tokens missing. Please log in again.');
        }

        const response = await api.get<Product[]>(`/product/all/by-brand?brand=${brand}`);
        return response.data;
    },
};
