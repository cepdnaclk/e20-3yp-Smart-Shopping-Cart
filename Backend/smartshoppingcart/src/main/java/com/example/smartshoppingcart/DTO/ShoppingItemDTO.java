package com.example.smartshoppingcart.DTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) representing a shopping item.
 * <p>
 * This class is used to transfer shopping item data between different layers of the application.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShoppingItemDTO {

    /**
     * The barcode of the shopping item.
     * <p>
     * Example: "1234567890123"
     */
    private String barcode;

    /**
     * The name of the shopping item.
     * <p>
     * Example: "Apple"
     */
    private String itemName;

    /**
     * The quantity of the shopping item.
     * <p>
     * Example: 5
     */
    private int quantity;

    /**
     * The weight of the shopping item.
     * <p>
     * Example: 1.5
     */
    private double weight;  // NEW FIELD
}
