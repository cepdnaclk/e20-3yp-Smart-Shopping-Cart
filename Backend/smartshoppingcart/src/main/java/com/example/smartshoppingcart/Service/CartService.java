package com.example.smartshoppingcart.Service;
import com.example.smartshoppingcart.DTO.CartDTO;
import java.util.List;


/**
 * Service interface for managing cart items.
 * <p>
 * This interface provides methods for CRUD operations on cart items.
 */
public interface CartService {

    /**
     * Retrieves all cart items.
     *
     * @return a list of all cart items
     */
    List<CartDTO> getAllItems();

    /**
     * Adds a new item to the cart.
     *
     * @param item the item to be added
     * @return the added cart item
     */
    CartDTO addItems(CartDTO item);

    /**
     * Updates an existing cart item.
     *
     * @param id the ID of the item to be updated
     * @param newItem the new item data
     * @return the updated cart item
     */
    CartDTO updateItem(Long id, CartDTO newItem);

    /**
     * Deletes a cart item by its ID.
     *
     * @param id the ID of the item to be deleted
     */
    void deleteItem(Long id);

    /**
     * Retrieves a cart item by its ID.
     *
     * @param id the ID of the item to be retrieved
     * @return the cart item with the specified ID
     */
    CartDTO getItemById(Long id);
}
