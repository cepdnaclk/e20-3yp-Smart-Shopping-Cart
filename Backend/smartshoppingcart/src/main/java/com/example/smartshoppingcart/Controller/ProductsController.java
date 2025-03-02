package com.example.smartshoppingcart.Controller;
import com.example.smartshoppingcart.DTO.*;
import com.example.smartshoppingcart.Model.Products;
import com.example.smartshoppingcart.Service.ProductsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for handling product-related operations.
 * <p>
 * Provides endpoints for managing products, including fetching, adding, updating, and deleting products.
 * Integrates with the ProductsService for business logic execution.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/products")
public class ProductsController {

    // Service for handling product-related operations.
    private final ProductsService productsService;

    /**
     * Endpoint to scan a barcode and check if it exists in the database.
     *
     * @param barcodeInputDTO Barcode input DTO.
     * @return Response entity with the barcode scan result.
     * <p>
     * Example:
     * POST /api/v1/products/scan-barcode
     * Request Body:
     * {
     *   "barcode": "1234567890123"
     * }
     * Response:
     * {
     *   "message": "Barcode exists",
     *   "product": {
     *     "id": 1,
     *     "name": "Product1",
     *     "price": 10.0
     *   }
     * }
     */
    @PostMapping("/scan-barcode")
    public ResponseEntity<BarcodeResponseDTO> scanBarcode(@RequestBody BarcodeInputDTO barcodeInputDTO) {
        if (barcodeInputDTO.getBarcode() == null || barcodeInputDTO.getBarcode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new BarcodeResponseDTO("Invalid barcode received."));
        }

        BarcodeResponseDTO response = productsService.scanBarcode(barcodeInputDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint to add a new product after barcode verification.
     *
     * @param addProductDTO Product details DTO.
     * @return Response entity with the added product.
     * <p>
     * Example:
     * POST /api/v1/products/add-product
     * Request Body:
     * {
     *   "name": "NewProduct",
     *   "category": "Category1",
     *   "price": 20.0,
     *   "barcode": "1234567890123"
     * }
     * Response:
     * {
     *   "id": 2,
     *   "name": "NewProduct",
     *   "category": "Category1",
     *   "price": 20.0,
     *   "barcode": "1234567890123"
     * }
     */
    @PostMapping("/add-product")
    public ResponseEntity<?> addProduct(@RequestBody AddProductDTO addProductDTO) {
        try {
            Products savedProduct = productsService.addProduct(addProductDTO);
            return ResponseEntity.ok(savedProduct);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint to update an existing product.
     *
     * @param updateProductDTO Product update DTO.
     * @return Response entity with the updated product.
     * <p>
     * Example:
     * PUT /api/v1/products/update-product
     * Request Body:
     * {
     *   "id": 1,
     *   "name": "UpdatedProduct",
     *   "category": "Category1",
     *   "price": 25.0,
     *   "barcode": "1234567890123"
     * }
     * Response:
     * {
     *   "id": 1,
     *   "name": "UpdatedProduct",
     *   "category": "Category1",
     *   "price": 25.0,
     *   "barcode": "1234567890123"
     * }
     */
    @PutMapping("/update-product")
    public ResponseEntity<?> updateProduct(@RequestBody UpdateProductDTO updateProductDTO) {
        try {
            Products updatedProduct = productsService.updateProduct(updateProductDTO);
            return ResponseEntity.ok(updatedProduct);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint to delete a product by barcode.
     *
     * @param deleteProductDTO Delete product DTO.
     * @return Response entity confirming deletion.
     * <p>
     * Example:
     * DELETE /api/v1/products/delete-product
     * Request Body:
     * {
     *   "barcode": "1234567890123"
     * }
     * Response:
     * "Product deleted successfully."
     */
    @DeleteMapping("/delete-product")
    public ResponseEntity<?> deleteProduct(@RequestBody DeleteProductDTO deleteProductDTO) {
        try {
            productsService.deleteProduct(deleteProductDTO);
            return ResponseEntity.ok("Product deleted successfully.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET endpoint to view a product by its identifier (ID or barcode).
     *
     * @param identifier The product identifier.
     * @return Response entity with the product details.
     * <p>
     * Example:
     * GET /api/v1/products/view/1
     * Response:
     * {
     *   "id": 1,
     *   "name": "Product1",
     *   "category": "Category1",
     *   "price": 10.0,
     *   "barcode": "1234567890123"
     * }
     */
    @GetMapping("/view/{identifier}")
    public ResponseEntity<?> viewProductByIdentifier(@PathVariable("identifier") Long identifier) {
        try {
            ViewProductDTO product = productsService.viewProduct(identifier);
            return ResponseEntity.ok(product);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET endpoint to view products by name and category.
     * Example: /api/v1/products/view?name=shoe&category=footwear
     *
     * @param name     The product name.
     * @param category The product category.
     * @return Response entity with a list of matching products.
     * <p>
     * Example:
     * GET /api/v1/products/view?name=Product1&category=Category1
     * Response:
     * [
     *   {
     *     "id": 1,
     *     "name": "Product1",
     *     "category": "Category1",
     *     "price": 10.0,
     *     "barcode": "1234567890123"
     *   }
     * ]
     */
    @GetMapping("/view")
    public ResponseEntity<?> viewProductByNameAndCategory(@RequestParam("name") String name,
                                                          @RequestParam("category") String category) {
        try {
            List<ViewProductDTO> products = productsService.viewProduct(name, category);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET endpoint to view products by name, category, and brand.
     * Example: /api/v1/products/view-with-brand?name=shoe&category=footwear&brand=nike
     *
     * @param name     The product name.
     * @param category The product category.
     * @param brand    The product brand.
     * @return Response entity with a list of matching products.
     * <p>
     * Example:
     * GET /api/v1/products/view-with-brand?name=Product1&category=Category1&brand=Brand1
     * Response:
     * [
     *   {
     *     "id": 1,
     *     "name": "Product1",
     *     "category": "Category1",
     *     "price": 10.0,
     *     "barcode": "1234567890123",
     *     "brand": "Brand1"
     *   }
     * ]
     */
    @GetMapping("/view-with-brand")
    public ResponseEntity<?> viewProductByNameCategoryAndBrand(@RequestParam("name") String name,
                                                               @RequestParam("category") String category,
                                                               @RequestParam("brand") String brand) {
        try {
            List<ViewProductDTO> products = productsService.viewProduct(name, category, brand);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
