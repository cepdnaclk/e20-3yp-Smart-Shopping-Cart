package com.sb.shoppinglistservice.dto;

import jakarta.validation.constraints.*;

public class ShoppingItemDTO {

    private Long id;

    @NotBlank(message = "Item name cannot be blank")
    @Size(min = 1, max = 100, message = "Item name must be between 1 and 100 characters")
    private String itemName;

    @NotNull(message = "Quantity cannot be null")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 100, message = "Quantity must be at most 100")
    private Integer quantity;

    @NotNull(message = "Weight cannot be null")
    @DecimalMin(value = "0.01", message = "Weight must be at least 0.01")
    @DecimalMax(value = "100.0", message = "Weight must be at most 100")
    private Double weight;

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
