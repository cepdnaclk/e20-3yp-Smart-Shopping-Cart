package com.example.smartshoppingcart.Service;
import com.example.smartshoppingcart.DTO.ShoppingItemDTO;
import com.example.smartshoppingcart.Model.ShoppingItem;
import com.example.smartshoppingcart.Repository.ShoppingItemRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for managing shopping lists.
 * <p>
 * This class provides methods for CRUD operations on shopping items.
 */
@Service
public class ShoppingListServiceImpl implements ShoppingListService {

    private final ShoppingItemRepository shoppingItemRepository;

    /**
     * Constructs a new ShoppingListServiceImpl with the specified repository.
     *
     * @param shoppingItemRepository the repository for shopping items
     */
    public ShoppingListServiceImpl(ShoppingItemRepository shoppingItemRepository) {
        this.shoppingItemRepository = shoppingItemRepository;
    }

    /**
     * Adds a new item to the shopping list for a specific user.
     *
     * @param userId the ID of the user
     * @param itemDTO the item to be added as a ShoppingItemDTO
     * @return the added shopping item as a ShoppingItem
     */
    @Override
    public ShoppingItem addItem(Integer userId, ShoppingItemDTO itemDTO) {
        ShoppingItem item = new ShoppingItem();
        item.setUserId(userId);
        item.setBarcode(itemDTO.getBarcode());
        item.setItemName(itemDTO.getItemName());
        item.setQuantity(itemDTO.getQuantity());
        item.setWeight(itemDTO.getWeight());
        return shoppingItemRepository.save(item);
    }

    /**
     * Retrieves the shopping list for a specific user.
     *
     * @param userId the ID of the user
     * @return a list of shopping items as ShoppingItemDTOs
     */
    @Override
    public List<ShoppingItemDTO> getShoppingList(Integer userId) {
        List<ShoppingItem> items = shoppingItemRepository.findByUserId(userId);
        return items.stream()
                .map(item -> {
                    ShoppingItemDTO dto = new ShoppingItemDTO();
                    dto.setBarcode(item.getBarcode());
                    dto.setItemName(item.getItemName());
                    dto.setQuantity(item.getQuantity());
                    dto.setWeight(item.getWeight());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Deletes a shopping item by its ID.
     *
     * @param itemId the ID of the item to be deleted
     */
    @Override
    public void deleteItem(Integer itemId) {
        shoppingItemRepository.deleteById(itemId);
    }

    /**
     * Updates an existing shopping item.
     *
     * @param itemId the ID of the item to be updated
     * @param updatedItem the new item data as a ShoppingItemDTO
     * @return the updated shopping item as a ShoppingItem
     * @throws RuntimeException if the item is not found
     */
    @Override
    public ShoppingItem updateItem(Integer itemId, ShoppingItemDTO updatedItem) {
        ShoppingItem existingItem = shoppingItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        existingItem.setBarcode(updatedItem.getBarcode());
        existingItem.setItemName(updatedItem.getItemName());
        existingItem.setQuantity(updatedItem.getQuantity());
        existingItem.setWeight(updatedItem.getWeight());

        return shoppingItemRepository.save(existingItem);
    }
}
