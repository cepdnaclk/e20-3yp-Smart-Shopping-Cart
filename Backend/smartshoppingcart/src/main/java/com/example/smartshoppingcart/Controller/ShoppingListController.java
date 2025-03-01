package com.example.smartshoppingcart.Controller;
import com.example.smartshoppingcart.DTO.ShoppingItemDTO;
import com.example.smartshoppingcart.Model.ShoppingItem;
import com.example.smartshoppingcart.Service.ShoppingListService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for handling shopping list-related operations.
 * <p>
 * Provides endpoints for managing shopping lists, including adding, retrieving, updating, and deleting items.
 * Integrates with the ShoppingListService for business logic execution.
 */
@RestController
@RequestMapping("/api/shopping-list")
public class ShoppingListController {

    private final ShoppingListService shoppingListService;

    /**
     * Constructor for ShoppingListController.
     *
     * @param shoppingListService The service for handling shopping list operations.
     */
    public ShoppingListController(ShoppingListService shoppingListService) {
        this.shoppingListService = shoppingListService;
    }

    /**
     * Endpoint to add a new item to the shopping list for a specific user.
     *
     * @param userId The ID of the user.
     * @param itemDTO The DTO containing item details.
     * @return The added ShoppingItem.
     * <p>
     * Example:
     * POST /api/shopping-list/add/1
     * Request Body:
     * {
     *   "name": "Milk",
     *   "quantity": 2
     * }
     * Response:
     * {
     *   "id": 1,
     *   "name": "Milk",
     *   "quantity": 2,
     *   "userId": 1
     * }
     */
    @PostMapping("/add/{userId}")
    public ShoppingItem addItem(@PathVariable Integer userId, @RequestBody ShoppingItemDTO itemDTO) {
        return shoppingListService.addItem(userId, itemDTO);
    }

    /**
     * Endpoint to retrieve the shopping list for a specific user.
     *
     * @param userId The ID of the user.
     * @return A list of ShoppingItemDTO objects representing the shopping list.
     * <p>
     * Example:
     * GET /api/shopping-list/1
     * Response:
     * [
     *   {
     *     "id": 1,
     *     "name": "Milk",
     *     "quantity": 2
     *   },
     *   {
     *     "id": 2,
     *     "name": "Bread",
     *     "quantity": 1
     *   }
     * ]
     */
    @GetMapping("/{userId}")
    public List<ShoppingItemDTO> getShoppingList(@PathVariable Integer userId) {
        return shoppingListService.getShoppingList(userId);
    }

    /**
     * Endpoint to delete an item from the shopping list by its ID.
     *
     * @param itemId The ID of the item to be deleted.
     * <p>
     * Example:
     * DELETE /api/shopping-list/delete/1
     * Response:
     * (No content)
     */
    @DeleteMapping("/delete/{itemId}")
    public void deleteItem(@PathVariable Integer itemId) {
        shoppingListService.deleteItem(itemId);
    }

    /**
     * Endpoint to update an existing item in the shopping list.
     *
     * @param itemId The ID of the item to be updated.
     * @param updatedItem The DTO containing updated item details.
     * @return The updated ShoppingItem.
     * <p>
     * Example:
     * PUT /api/shopping-list/update/1
     * Request Body:
     * {
     *   "name": "Milk",
     *   "quantity": 3
     * }
     * Response:
     * {
     *   "id": 1,
     *   "name": "Milk",
     *   "quantity": 3,
     *   "userId": 1
     * }
     */
    @PutMapping("/update/{itemId}")
    public ShoppingItem updateItem(@PathVariable Integer itemId, @RequestBody ShoppingItemDTO updatedItem) {
        return shoppingListService.updateItem(itemId, updatedItem);
    }
}
