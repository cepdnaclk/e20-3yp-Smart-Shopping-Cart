package com.example.smartshoppingcart.Service;

import com.example.smartshoppingcart.DTO.*;
import com.example.smartshoppingcart.Model.Products;
import com.example.smartshoppingcart.Repository.ProductsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for handling product-related operations.
 * <p>
 * Provides business logic for managing products, including fetching, adding, updating, and deleting products.
 * Integrates with the ProductsRepository for data access.
 */
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductsService {

    private final ProductsRepository productsRepository; // Repository for the Products entity.

    // A sample list of valid categories. In a real application, these might come from a config or database.
    //This is for demonstration only
    private static final Set<String> VALID_CATEGORIES = new HashSet<>(List.of("shoe", "shirt", "electronics", "grocery", "book"));

    // Add this field to hold the temporary barcode
    private String tempBarcode = null;

    /**
     * Check if the barcode exists in the database.
     *
     * @param barcodeInputDTO The barcode input DTO.
     * @return A response DTO indicating whether the barcode exists or not.
     */
    @Override
    @Transactional(readOnly = true)
    public BarcodeResponseDTO scanBarcode(BarcodeInputDTO barcodeInputDTO) {
        Optional<Products> existingProduct = productsRepository.findByBarcode(barcodeInputDTO.getBarcode());

        if (existingProduct.isPresent()) {
            return new BarcodeResponseDTO("Barcode already exists.");
        }
        // Save the barcode temporarily for later use in addProduct
        tempBarcode = barcodeInputDTO.getBarcode();
        return new BarcodeResponseDTO("Barcode scanned successfully. Add item details.");
    }


    /**
     * Add a new product to the database.
     *
     * @param addProductDTO The product details to add.
     * @return The added product.
     */
    @Transactional
    @Override
    public Products addProduct(AddProductDTO addProductDTO) {

        // First, ensure that the barcode has been scanned and matches the one provided.
        if (tempBarcode == null) {
            throw new IllegalStateException("Barcode has not been scanned.");
        }

        Optional<Products> existingProduct = productsRepository.findByBarcode(tempBarcode);
        if (existingProduct.isPresent()) {
            throw new IllegalStateException("Cannot add product. Barcode already exists.");
        }

        // Ensure the category is stored in lowercase for consistency.
        String productCategory = addProductDTO.getCategory().toLowerCase();

        Products newProduct = Products.builder()
                .name(addProductDTO.getName())
                .description(addProductDTO.getDescription())
                .price(addProductDTO.getPrice())
                .stock(addProductDTO.getStock())
                .category(productCategory)
                .brand(addProductDTO.getBrand())
                .weight(addProductDTO.getWeight())
                .barcode(tempBarcode)
                .discount(addProductDTO.getDiscount())
                .build();

        Products savedProduct = productsRepository.save(newProduct);

        // Dynamically update the valid categories set if the category is not already present.
        VALID_CATEGORIES.add(productCategory);

        // Clear the temporary barcode after successfully adding the product.
        tempBarcode = null;

        return savedProduct;
    }

    /**
     * Update an existing product.
     *
     * @param updateProductDTO The product details to update.
     * @return The updated product.
     */
    @Override
    @Transactional
    public Products updateProduct(UpdateProductDTO updateProductDTO) {
        Products existingProduct = productsRepository.findByBarcode(updateProductDTO.getBarcode())
                .orElseThrow(() -> new IllegalStateException("Product not found with barcode: " + updateProductDTO.getBarcode()));

        /// Update only non-null fields

        // Update the product's name if the new name is not null.
        if (updateProductDTO.getName() != null) {
            existingProduct.setName(updateProductDTO.getName());
        }

        // Update the product's description if the new description is not null.
        if (updateProductDTO.getDescription() != null) {
            existingProduct.setDescription(updateProductDTO.getDescription());
        }

        // Update the product's price if the new price is not null.
        if (updateProductDTO.getPrice() != null) {
            existingProduct.setPrice(updateProductDTO.getPrice());
        }

        // Update the product's stock if the new stock is not null.
        if (updateProductDTO.getStock() != null) {
            existingProduct.setStock(updateProductDTO.getStock());
        }

        // Update the product's discount if the new discount is not null.
        if (updateProductDTO.getDiscount() != null) {
            existingProduct.setDiscount(updateProductDTO.getDiscount());
        }

        // Update the product's weight if the new weight is not null.
        if (updateProductDTO.getWeight() != null) {
            existingProduct.setWeight(updateProductDTO.getWeight());
        }

        return productsRepository.save(existingProduct);
    }

    /**
     * Delete a product by its barcode.
     *
     * @param deleteProductDTO The barcode of the product to delete.
     */
    @Override
    @Transactional
    public void deleteProduct(DeleteProductDTO deleteProductDTO) {
        Products existingProduct = productsRepository.findByBarcode(deleteProductDTO.getBarcode())
                .orElseThrow(() -> new IllegalStateException("Product not found with barcode: " + deleteProductDTO.getBarcode()));

        productsRepository.delete(existingProduct);
    }

    /**
     * View a product by its identifier.
     *
     * @param identifier The identifier of the product to view it can be id or barcode.
     * @return The product details.
     */
    @Override
    @Transactional(readOnly = true)
    public ViewProductDTO viewProduct(Long identifier) {
        // First, try to find the product by ID
        Optional<Products> productById = productsRepository.findById(identifier);

        if (productById.isPresent()) {
            return mapToViewProductDTO(productById.get());
        }

        // If not found by ID, try to find by barcode
        Optional<Products> productByBarcode = productsRepository.findByBarcode(String.valueOf(identifier));

        if (productByBarcode.isPresent()) {
            return mapToViewProductDTO(productByBarcode.get());
        }

        throw new IllegalStateException("Product not found with identifier: " + identifier);
    }

    private ViewProductDTO mapToViewProductDTO(Products product) {
        return ViewProductDTO.builder()
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .image(product.getImage())
                .brand(product.getBrand())
                .weight(product.getWeight())
                .discount(product.getDiscount())
                .category(product.getCategory())
                .build();
    }


    /**
     * View a product by its name and category.
     *
     * @param name     The name of the product.
     * @param category The category of the product.
     * @return A list of product details.
     */
    @Override
    @Transactional(readOnly = true)
    public List<ViewProductDTO> viewProduct(String name, String category) {
        // Convert to lowercase for case-insensitive search
        String lowercaseName = name.toLowerCase();
        String lowercaseCategory = category.toLowerCase();

        // Resolve the category using our multi-step approach
        String resolvedCategory = resolveCategory(lowercaseName, lowercaseCategory);

        // Search for products with the given name and resolved category
        List<Products> products = productsRepository.findByNameContainingIgnoreCaseAndCategory(lowercaseName, resolvedCategory);

        return products.stream()
                .map(this::mapToViewProductDTO)
                .collect(Collectors.toList());
    }

    /**
     * View a product by its name, category, and brand.
     *
     * @param name     The name of the product.
     * @param category The category of the product.
     * @param brand    The brand of the product.
     * @return A list of product details.
     */
    @Override
    @Transactional(readOnly = true)
    public List<ViewProductDTO> viewProduct(String name, String category, String brand) {
        // Convert to lowercase for case-insensitive search
        String lowercaseName = name.toLowerCase();
        String lowercaseCategory = category.toLowerCase();
        String lowercaseBrand = brand.toLowerCase();

        // Resolve the category using our multi-step approach
        String resolvedCategory = resolveCategory(lowercaseName, lowercaseCategory);

        // Search for products with the given name and resolved category
        List<Products> products = productsRepository.findByNameContainingIgnoreCaseAndCategory(lowercaseName, resolvedCategory);

        // Filter products by best matching brand
        List<Products> filteredProducts = products.stream()
                .filter(product -> isBestBrandMatch(product.getBrand().toLowerCase(), lowercaseBrand))
                .toList();

        return filteredProducts.stream()
                .map(this::mapToViewProductDTO)
                .collect(Collectors.toList());
    }

    /**
     * Resolves the best matching category using a multi-step approach:
     * 1. Try the original input.
     * 2. If no products are found, try removing a trailing 's'.
     * 3. If still no match, attempt a simple spell-correction.
     *
     * @param lowercaseName     The lowercase product name (used for filtering).
     * @param inputCategory The input category in lowercase.
     * @return The resolved category to use in repository queries.
     */
    private String resolveCategory(String lowercaseName, String inputCategory) {
        // Step 1: Try the category as provided.
        if (!productsRepository.findByNameContainingIgnoreCaseAndCategory(lowercaseName, inputCategory).isEmpty()) {
            return inputCategory;
        }

        // Step 2: If the category ends with 's', try removing it.
        String modifiedCategory = inputCategory;
        if (inputCategory.endsWith("s")) {
            modifiedCategory = inputCategory.substring(0, inputCategory.length() - 1);
            if (!productsRepository.findByNameContainingIgnoreCaseAndCategory(lowercaseName, modifiedCategory).isEmpty()) {
                return modifiedCategory;
            }
        }

        // Step 3: Attempt to correct possible spelling mistakes.
        String correctedCategory = correctGrammar(inputCategory);
        if (!correctedCategory.equalsIgnoreCase(inputCategory) &&
                !productsRepository.findByNameContainingIgnoreCaseAndCategory(lowercaseName, correctedCategory).isEmpty()) {
            return correctedCategory;
        }

        // If no alternative returned any products, fall back to the original input.
        return inputCategory;
    }

    /**
     * Attempts to correct the category string using a simple comparison against a list of valid categories.
     *
     * @param category The category string to check.
     * @return The corrected category if a close match is found; otherwise, returns the original.
     */
    private String correctGrammar(String category) {
        int minDistance = Integer.MAX_VALUE;
        String bestMatch = category;
        for (String validCategory : VALID_CATEGORIES) {
            int distance = levenshteinDistance(category, validCategory);
            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = validCategory;
            }
        }
        // Use a threshold for correction (e.g., if the distance is small enough, assume it's a misspelling)
        return (minDistance <= 2) ? bestMatch : category;
    }

    /**
     * Computes the Levenshtein distance between two strings.
     *
     * @param s The first string.
     * @param t The second string.
     * @return The Levenshtein distance.
     */
    private int levenshteinDistance(String s, String t) {
        int[][] dp = new int[s.length() + 1][t.length() + 1];

        for (int i = 0; i <= s.length(); i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= t.length(); j++) {
            dp[0][j] = j;
        }
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 1; j <= t.length(); j++) {
                int cost = (s.charAt(i - 1) == t.charAt(j - 1)) ? 0 : 1;
                dp[i][j] = Math.min(
                        Math.min(dp[i - 1][j] + 1,    // deletion
                                dp[i][j - 1] + 1),   // insertion
                        dp[i - 1][j - 1] + cost);     // substitution
            }
        }
        return dp[s.length()][t.length()];
    }

    /**
     * Checks if the input brand is a substring of the product brand.
     *
     * @param productBrand The brand of the product.
     * @param inputBrand The brand to check against the product brand.
     * @return true if the input brand is a substring of the product brand, false otherwise.
     */
    private boolean isBestBrandMatch(String productBrand, String inputBrand) {
        // Simple best match logic: check if the input brand is a substring of the product brand
        return productBrand.contains(inputBrand);
    }


    /**
     * Get all products.
     *
     * @return A list of all products.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Products> getAllProducts() {
        return List.of();
    }

    /**
     * Get all products in a category.
     *
     * @param category The category of products to fetch.
     * @return A list of products in the given category.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Products> getProductsByCategory(String category) {
        return List.of();
    }

    /**
     * Get all products with a price less than the given amount.
     *
     * @param price The maximum price of products to fetch.
     * @return A list of products with a price less than the given amount.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Products> getProductsByPriceLessThan(double price) {
        return List.of();
    }

    /**
     * Get all products with a price greater than the given amount.
     *
     * @param price The minimum price of products to fetch.
     * @return A list of products with a price greater than the given amount.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Products> getProductsByPriceGreaterThan(double price) {
        return List.of();
    }

    /**
     * Get all products with a price between the given amounts.
     *
     * @param minPrice The minimum price of products to fetch.
     * @param maxPrice The maximum price of products to fetch.
     * @return A list of products with a price between the given amounts.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Products> getProductsByPriceBetween(double minPrice, double maxPrice) {
        return List.of();
    }

    /**
     * Get all products with a stock quantity less than the given amount.
     *
     * @param quantity The maximum stock quantity of products to fetch.
     *
     * @return A list of products with a stock quantity less than the given amount.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Products> getProductsByStockLessThan(int quantity) {
        return List.of();
    }
}
