package com.example.smartshoppingcart.DTO;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

/**
 * Data Transfer Object (DTO) for adding a product.
 * <p>
 * This class is used to transfer product data between different layers of the application.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddProductDTO {

    /**
     * The name of the product.
     * <p>
     * Example: "Laptop"
     */
    @NotNull
    @Size(min = 1, max = 35)
    private String name;

    /**
     * The description of the product.
     * <p>
     * Example: "A high-performance laptop suitable for gaming and work."
     */
    @NotNull
    @Size(min = 1, max = 250)
    private String description;

    /**
     * The price of the product.
     * <p>
     * Example: 999.99
     */
    @NotNull
    private Double price;

    /**
     * The stock quantity of the product.
     * <p>
     * Example: 50
     */
    @NotNull
    private Integer stock;

    /**
     * The image of the product.
     * <p>
     * Example: A file representing the product image.
     */
    @NotNull
    private MultipartFile image;

    /**
     * The category of the product.
     * <p>
     * Example: "Electronics"
     */
    @NotNull
    private String category;

    /**
     * The brand of the product.
     * <p>
     * Example: "BrandName"
     */
    @NotNull
    private String brand;

    /**
     * The weight of the product.
     * <p>
     * Example: 2.5 (in kilograms)
     */
    @NotNull
    private Double weight;

    /**
     * The discount of the product.
     * <p>
     * Example: 10.0 (representing a 10% discount)
     */
    private Double discount;
}
