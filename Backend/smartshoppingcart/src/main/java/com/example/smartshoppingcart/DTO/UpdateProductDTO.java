package com.example.smartshoppingcart.DTO;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

/**
 * Data Transfer Object (DTO) for updating a product.
 * <p>
 * This class is used to transfer product update data between different layers of the application.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProductDTO {

    /**
     * Barcode of the product to update.
     * <p>
     * Example: "1234567890123"
     */
    @NotNull
    private String barcode;

    /**
     * New name of the product.
     * <p>
     * Example: "New Product Name"
     */
    private String name;

    /**
     * New description of the product.
     * <p>
     * Example: "This is a new description for the product."
     */
    private String description;

    /**
     * New price of the product.
     * <p>
     * Example: 19.99
     */
    private Double price;

    /**
     * New stock of the product.
     * <p>
     * Example: 100
     */
    private Integer stock;

    /**
     * New image of the product.
     * <p>
     * Example: MultipartFile containing the new image
     */
    private MultipartFile image;

    /**
     * New weight of the product.
     * <p>
     * Example: 1.5
     */
    private Double weight;

    /**
     * New discount of the product.
     * <p>
     * Example: 0.15
     */
    private Double discount;

}