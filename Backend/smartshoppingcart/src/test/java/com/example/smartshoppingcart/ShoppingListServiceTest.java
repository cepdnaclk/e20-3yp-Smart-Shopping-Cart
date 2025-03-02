package com.example.smartshoppingcart;
import com.example.smartshoppingcart.DTO.ShoppingItemDTO;
import com.example.smartshoppingcart.Model.ShoppingItem;
import com.example.smartshoppingcart.Repository.ShoppingItemRepository;
import com.example.smartshoppingcart.Service.ShoppingListServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.when;

class ShoppingListServiceImplTest {

    @Mock
    private ShoppingItemRepository shoppingItemRepository;

    @InjectMocks
    private ShoppingListServiceImpl shoppingListService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addItemSuccessfully() {
        ShoppingItemDTO itemDTO = new ShoppingItemDTO("123456", "Milk", 2, 1.0);
        ShoppingItem item = new ShoppingItem(1, 1, "123456", "Milk", 2, 1.0);

        when(shoppingItemRepository.save(any(ShoppingItem.class))).thenReturn(item);

        ShoppingItem result = shoppingListService.addItem(1, itemDTO);

        assertNotNull(result);
        assertEquals("Milk", result.getItemName());
        assertEquals(2, result.getQuantity());
    }

    @Test
    void getShoppingListSuccessfully() {
        ShoppingItem item1 = new ShoppingItem(1, 1, "123456", "Milk", 2, 1.0);
        ShoppingItem item2 = new ShoppingItem(2, 1, "789012", "Bread", 1, 0.5);

        when(shoppingItemRepository.findByUserId(1)).thenReturn(Arrays.asList(item1, item2));

        List<ShoppingItemDTO> result = shoppingListService.getShoppingList(1);

        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void deleteItemSuccessfully() {
        doNothing().when(shoppingItemRepository).deleteById(1);

        shoppingListService.deleteItem(1);

        verify(shoppingItemRepository, times(1)).deleteById(1);
    }

    @Test
    void updateItemSuccessfully() {
        ShoppingItemDTO updatedItemDTO = new ShoppingItemDTO("123456", "Milk", 3, 1.0);
        ShoppingItem existingItem = new ShoppingItem(1, 1, "123456", "Milk", 2, 1.0);

        when(shoppingItemRepository.findById(1)).thenReturn(Optional.of(existingItem));
        when(shoppingItemRepository.save(any(ShoppingItem.class))).thenReturn(existingItem);

        ShoppingItem result = shoppingListService.updateItem(1, updatedItemDTO);

        assertNotNull(result);
        assertEquals(3, result.getQuantity());
    }

    @Test
    void updateItemNotFound() {
        ShoppingItemDTO updatedItemDTO = new ShoppingItemDTO("123456", "Milk", 3, 1.0);

        when(shoppingItemRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> shoppingListService.updateItem(1, updatedItemDTO));
    }
}
