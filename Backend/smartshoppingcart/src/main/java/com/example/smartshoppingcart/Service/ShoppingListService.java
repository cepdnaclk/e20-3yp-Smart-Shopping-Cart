package com.example.smartshoppingcart.Service;
import com.example.smartshoppingcart.DTO.ShoppingItemDTO;
import com.example.smartshoppingcart.Model.ShoppingItem;
import java.util.List;

/**
 * Service interface for managing shopping lists.
 * <p>
 * This interface provides methods for CRUD operations on shopping items.
 */
public interface ShoppingListService {

    /**
     * Adds a new item to the shopping list for a specific user.
     *
     * @param userId the ID of the user
     * @param itemDTO the item to be added as a ShoppingItemDTO
     * @return the added shopping item as a ShoppingItem
     */
    ShoppingItem addItem(Integer userId, ShoppingItemDTO itemDTO);

    /**
     * Retrieves the shopping list for a specific user.
     *
     * @param userId the ID of the user
     * @return a list of shopping items as ShoppingItemDTOs
     */
    List<ShoppingItemDTO> getShoppingList(Integer userId);

    /**
     * Deletes a shopping item by its ID.
     *
     * @param itemId the ID of the item to be deleted
     */
    void deleteItem(Integer itemId);

    /**
     * Updates an existing shopping item.
     *
     * @param itemId the ID of the item to be updated
     * @param updatedItem the new item data as a ShoppingItemDTO
     * @return the updated shopping item as a ShoppingItem
     */
    ShoppingItem updateItem(Integer itemId, ShoppingItemDTO updatedItem);
}
