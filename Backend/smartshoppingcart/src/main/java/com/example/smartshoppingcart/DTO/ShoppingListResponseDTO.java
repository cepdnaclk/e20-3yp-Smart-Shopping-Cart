package com.example.smartshoppingcart.DTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object (DTO) representing a response containing a shopping list.
 * <p>
 * This class is used to transfer shopping list data, including the user ID and a list of shopping items.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShoppingListResponseDTO {

    /**
     * The ID of the user to whom the shopping list belongs.
     * <p>
     * Example: 123
     */
    private Integer userId;

    /**
     * The list of shopping items in the user's shopping list.
     * <p>
     * Each item is represented by a ShoppingItemDTO object.
     */
    private List<ShoppingItemDTO> items;
}
