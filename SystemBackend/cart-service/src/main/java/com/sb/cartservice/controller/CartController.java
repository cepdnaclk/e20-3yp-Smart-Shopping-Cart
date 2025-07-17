package com.sb.cartservice.controller;

import com.sb.cartservice.dto.CartDTO;
import com.sb.cartservice.dto.ProductDTO;
import com.sb.cartservice.dto.UserCartSummaryDTO;
import com.sb.cartservice.service.CartService;
import com.sb.productservice.grpc.ProductDetailsResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // 🔍 Get product details by scanned barcode (used before adding to cart)
    @GetMapping("/customer/product-details")
    public ResponseEntity<?> getProductDetails(@RequestParam String barcode) {
        try {
            // Call gRPC service to get product
            ProductDetailsResponse grpcProduct = cartService.fetchProductDetailsForFrontend(barcode);

            // If product does not exist, return 404
            if (!grpcProduct.getExists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Product not found for barcode: " + barcode);
            }

            // Map gRPC response to DTO
            ProductDTO dto = new ProductDTO();
            dto.setName(grpcProduct.getProductName());
            dto.setPrice(grpcProduct.getProductPrice());
            dto.setQuantity(grpcProduct.getProductQuantity());
            dto.setWeight(grpcProduct.getProductWeight());

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Failed to fetch product details: " + e.getMessage());
        }
    }


    // 🔍 Get all cart items for all users
    @GetMapping("/customer/all")
    public ResponseEntity<?> getAllItems() {
        try {
            List<CartDTO> items = cartService.getAllItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to retrieve cart items: " + e.getMessage());
        }
    }

    // 🔍 Get cart items for a specific user
    @GetMapping("/auth/user/{userId}")
    public ResponseEntity<?> getItemsByUserId(@PathVariable String userId) {
        try {
            List<CartDTO> items = cartService.getItemsByUserId(userId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to retrieve items for user " + userId + ": " + e.getMessage());
        }
    }

    // ➕ Add an item to the cart
    @PostMapping("/customer/add")
    public ResponseEntity<?> addItem(@RequestBody @Valid CartDTO item) {
        try {
            CartDTO saved = cartService.addItems(item);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to add item: " + e.getMessage());
        }
    }

    // 🔄 Update an existing cart item
    @PutMapping("/customer/update")
    public ResponseEntity<?> updateItem(@RequestBody @Valid CartDTO item) {
        try {
            CartDTO updated = cartService.updateItems(item);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update item: " + e.getMessage());
        }
    }

    // ❌ Delete an item from the cart
    @DeleteMapping("/customer/delete/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            cartService.deleteItems(id);
            return ResponseEntity.ok("Item deleted successfully with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete item with ID " + id + ": " + e.getMessage());
        }
    }

    // 🔍 Get a single item by ID
    @GetMapping("/customer/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        try {
            CartDTO item = cartService.getItemById(id);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to retrieve item with ID " + id + ": " + e.getMessage());
        }
    }

    // 🔄 Trigger gRPC bill update and return result
    @GetMapping("/customer/addBill/{userId}")
    public ResponseEntity<?> triggerGrpcBillUpdate(@PathVariable String userId) {
        try {
            String result = cartService.getUserCartSummaryAndSendToGrpc(userId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update bill for user " + userId + ": " + e.getMessage());
        }
    }

}
