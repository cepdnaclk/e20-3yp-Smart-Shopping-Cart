package com.example.smartshoppingcart.Service;

import com.example.smartshoppingcart.DTO.*;
import com.example.smartshoppingcart.Model.Products;

import java.util.List;

/**
 * Service for handling product-related operations.
 * <p>
 * Provides business logic for managing products, including fetching, adding, updating, and deleting products.
 * Integrates with the ProductsRepository for data access.
 */
public interface ProductsService {

    /**
     * Check if the barcode exists in the database.
     *
     * @param barcodeInputDTO The barcode input DTO.
     * @return A response DTO indicating whether the barcode exists or not.
     */
    BarcodeResponseDTO scanBarcode(BarcodeInputDTO barcodeInputDTO);

    /**
     * Add a new product.
     *
     * @param addProductDTO The product to add.
     * @return The added product.
     */
    Products addProduct(AddProductDTO addProductDTO);

    /**
     * Update an existing product.
     *
     * @param updateProductDTO The product details to update.
     * @return The updated product.
     */
    Products updateProduct(UpdateProductDTO updateProductDTO);

    /**
     * Delete a product.
     *
     * @param deleteProductDTO The product to delete.
     */
    void deleteProduct(DeleteProductDTO deleteProductDTO);

    /**
     * View a product by its identifier.
     *
     * @param identifier The identifier of the product to view it can be id or barcode.
     * @return The product details.
     */
    ViewProductDTO viewProduct(Long identifier);

    /**
     * View a product by its name.
     *
     * @param name The name of the product.
     * @return The product details.
     */
    List<ViewProductDTO> viewProduct(String name, String category);

    /**
     * View a product by its name, category, and brand.
     *
     * @param name The name of the product.
     * @param Category The category of the product.
     * @param brand The brand of the product.
     * @return The product details.
     */
    List<ViewProductDTO> viewProduct(String name, String Category, String brand);

    /**
     * Get all products.
     *
     * @return A list of all products.
     */
    List<Products> getAllProducts();

    /**
     * Get all products in a category.
     *
     * @param category The category of products to fetch.
     * @return A list of products in the given category.
     */
    List<Products> getProductsByCategory(String category);

    /**
     * Get all products with a price less than the given amount.
     *
     * @param price The maximum price of products to fetch.
     * @return A list of products with a price less than the given amount.
     */
    List<Products> getProductsByPriceLessThan(double price);

    /**
     * Get all products with a price greater than the given amount.
     *
     * @param price The minimum price of products to fetch.
     * @return A list of products with a price greater than the given amount.
     */
    List<Products> getProductsByPriceGreaterThan(double price);

    /**
     * Get all products with a price between the given amounts.
     *
     * @param minPrice The minimum price of products to fetch.
     * @param maxPrice The maximum price of products to fetch.
     * @return A list of products with a price between the given amounts.
     */
    List<Products> getProductsByPriceBetween(double minPrice, double maxPrice);

    /**
     * Get all products with a stock quantity less than the given amount.
     *
     * @param quantity The maximum stock quantity of products to fetch.
     *
     * @return A list of products with a stock quantity less than the given amount.
     */
    List<Products> getProductsByStockLessThan(int quantity);
}
