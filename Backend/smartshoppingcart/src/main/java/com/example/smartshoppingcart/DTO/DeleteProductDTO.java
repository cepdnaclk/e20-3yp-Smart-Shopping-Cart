package com.example.smartshoppingcart.DTO;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for deleting a product.
 * <p>
 * This class is used to transfer product deletion data between different layers of the application.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeleteProductDTO {

    /**
     * Barcode of the product to delete.
     * <p>
     * Example: "1234567890123"
     */
    @NotNull
    private String barcode;

}
