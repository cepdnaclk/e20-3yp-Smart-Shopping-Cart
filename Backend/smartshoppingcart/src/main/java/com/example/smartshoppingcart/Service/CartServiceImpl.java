package com.example.smartshoppingcart.Service;
import com.example.smartshoppingcart.DTO.CartDTO;
import com.example.smartshoppingcart.Model.CartModel;
import com.example.smartshoppingcart.Repository.CartRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


/**
 * Service implementation for managing cart items.
 * <p>
 * This class provides methods for CRUD operations on cart items.
 */
@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepo cartRepo;

    /**
     * Converts a CartModel entity to a CartDTO.
     *
     * @param item the CartModel entity
     * @return the corresponding CartDTO
     */
    private CartDTO convertToDTO(CartModel item) {
        return new CartDTO(item.getId(), item.getName(), item.getQuantity(), item.getPrice());
    }

    /**
     * Converts a CartDTO to a CartModel entity.
     *
     * @param dto the CartDTO
     * @return the corresponding CartModel entity
     */
    private CartModel convertToModel(CartDTO dto) {
        CartModel item = new CartModel();
        item.setId(dto.getId());
        item.setName(dto.getName());
        item.setPrice(dto.getPrice());
        item.setQuantity(dto.getQuantity());
        return item;
    }

    /**
     * Retrieves all cart items.
     *
     * @return a list of all cart items as CartDTOs
     */
    @Override
    public List<CartDTO> getAllItems() {
        return cartRepo.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Retrieves a cart item by its ID.
     *
     * @param id the ID of the cart item
     * @return the cart item as a CartDTO, or null if not found
     */
    @Override
    public CartDTO getItemById(Long id) {
        Optional<CartModel> item = cartRepo.findById(id);
        return item.map(this::convertToDTO).orElse(null);
    }

    /**
     * Adds a new item to the cart.
     *
     * @param itemDTO the item to be added as a CartDTO
     * @return the added cart item as a CartDTO
     */
    @Override
    public CartDTO addItems(CartDTO itemDTO) {
        CartModel item = convertToModel(itemDTO);
        CartModel savedItem = cartRepo.save(item);
        return convertToDTO(savedItem);
    }

    /**
     * Updates an existing cart item.
     *
     * @param id the ID of the item to be updated
     * @param updatedDTO the new item data as a CartDTO
     * @return the updated cart item as a CartDTO
     * @throws RuntimeException if the item is not found
     */
    @Override
    public CartDTO updateItem(Long id, CartDTO updatedDTO) {
        return cartRepo.findById(id).map(item -> {
            item.setName(updatedDTO.getName());
            item.setPrice(updatedDTO.getPrice());
            item.setQuantity(updatedDTO.getQuantity());
            return convertToDTO(cartRepo.save(item));
        }).orElseThrow(() -> new RuntimeException("Item not found"));
    }

    /**
     * Deletes a cart item by its ID.
     *
     * @param id the ID of the item to be deleted
     */
    @Override
    public void deleteItem(Long id) {
        cartRepo.deleteById(id);
    }
}
