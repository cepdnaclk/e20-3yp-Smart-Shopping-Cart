package com.sb.shoppinglistservice.service;

import com.sb.shoppinglistservice.dto.GetShoppingItemsDTO;
import com.sb.shoppinglistservice.dto.ShoppingItemDTO;

import java.util.List;

public interface ShoppingListService {

    String addItem(ShoppingItemDTO itemDTO);

    String updateItem(ShoppingItemDTO itemDTO);

    List<GetShoppingItemsDTO> getItems();

    void deleteItem(String itemId);

    void deleteAllItems();
}
