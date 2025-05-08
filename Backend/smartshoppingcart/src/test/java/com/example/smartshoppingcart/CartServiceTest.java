package com.example.smartshoppingcart;

import com.example.smartshoppingcart.DTO.CartDTO;
import com.example.smartshoppingcart.Model.CartModel;
import com.example.smartshoppingcart.Repository.CartRepo;
import com.example.smartshoppingcart.Service.CartServiceImpl;
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

class CartServiceImplTest {

    @Mock
    private CartRepo cartRepo;

    @InjectMocks
    private CartServiceImpl cartService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addItemsSuccessfully() {
        CartDTO itemDTO = new CartDTO(1L, "Item1", 2, 10.0);
        CartModel item = new CartModel(1L, "Item1", 2, 10.0);

        when(cartRepo.save(any(CartModel.class))).thenReturn(item);

        CartDTO result = cartService.addItems(itemDTO);

        assertNotNull(result);
        assertEquals("Item1", result.getName());
        assertEquals(2, result.getQuantity());
    }

    @Test
    void getAllItemsSuccessfully() {
        CartModel item1 = new CartModel(1L, "Item1", 2, 10.0);
        CartModel item2 = new CartModel(2L, "Item2", 1, 5.0);

        when(cartRepo.findAll()).thenReturn(Arrays.asList(item1, item2));

        List<CartDTO> result = cartService.getAllItems();

        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void getItemByIdSuccessfully() {
        CartModel item = new CartModel(1L, "Item1", 2, 10.0);

        when(cartRepo.findById(1L)).thenReturn(Optional.of(item));

        CartDTO result = cartService.getItemById(1L);

        assertNotNull(result);
        assertEquals("Item1", result.getName());
    }

    @Test
    void getItemByIdNotFound() {
        when(cartRepo.findById(1L)).thenReturn(Optional.empty());

        CartDTO result = cartService.getItemById(1L);

        assertNull(result);
    }

    @Test
    void updateItemSuccessfully() {
        CartDTO updatedDTO = new CartDTO(1L, "Item1", 3, 15.0);
        CartModel existingItem = new CartModel(1L, "Item1", 2, 10.0);

        when(cartRepo.findById(1L)).thenReturn(Optional.of(existingItem));
        when(cartRepo.save(any(CartModel.class))).thenReturn(existingItem);

        CartDTO result = cartService.updateItem(1L, updatedDTO);

        assertNotNull(result);
        assertEquals(3, result.getQuantity());
    }

    @Test
    void updateItemNotFound() {
        CartDTO updatedDTO = new CartDTO(1L, "Item1", 3, 15.0);

        when(cartRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> cartService.updateItem(1L, updatedDTO));
    }

    @Test
    void deleteItemSuccessfully() {
        doNothing().when(cartRepo).deleteById(1L);

        cartService.deleteItem(1L);

        verify(cartRepo, times(1)).deleteById(1L);
    }
}