package com.example.smartshoppingcart.DTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for viewing product details.
 * <p>
 * This class is used to transfer product details data between different layers of the application.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ViewProductDTO {

    /**
     * The name of the product.
     * <p>
     * Example: "Apple iPhone 13"
     */
    private String name;

    /**
     * The description of the product.
     * <p>
     * Example: "Latest model of Apple iPhone with 128GB storage."
     */
    private String description;

    /**
     * The price of the product.
     * <p>
     * Example: 999.99
     */
    private Double price;

    /**
     * The stock quantity of the product.
     * <p>
     * Example: 50
     */
    private Integer stock;

    /**
     * The image URL of the product.
     * <p>
     * Example: "<a href="http://example.com/images/iphone13.jpg">...</a>"
     */
    private String image;

    /**
     * The brand of the product.
     * <p>
     * Example: "Apple"
     */
    private String brand;

    /**
     * The weight of the product.
     * <p>
     * Example: 0.174
     */
    private Double weight;

    /**
     * The discount on the product.
     * <p>
     * Example: 0.10
     */
    private Double discount;

    /**
     * The category of the product.
     * <p>
     * Example: "Electronics"
     */
    private String category;

}
