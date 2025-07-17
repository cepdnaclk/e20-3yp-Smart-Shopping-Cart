package com.sb.shoppinglistservice.controller;

import com.sb.shoppinglistservice.dto.GetShoppingItemsDTO;
import com.sb.shoppinglistservice.dto.ShoppingItemDTO;
import com.sb.shoppinglistservice.service.ShoppingListService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shopping-list")
public class ShoppingListController {

    private static final Logger log = LoggerFactory.getLogger(ShoppingListController.class);

    private final ShoppingListService shoppingListService;

    public ShoppingListController(ShoppingListService shoppingListService) {
        this.shoppingListService = shoppingListService;
    }

    // POST /shopping-list/add
    @PostMapping("/add")
    public ResponseEntity<String> addItem(@RequestBody @Valid ShoppingItemDTO itemDTO) {
        log.info("🛒 API call to add item: {}", itemDTO.getItemName());
        String response = shoppingListService.addItem(itemDTO);
        return ResponseEntity.ok(response);
    }

    // PUT /shopping-list/update
    @PutMapping("/update")
    public ResponseEntity<String> updateItem(@RequestBody @Valid ShoppingItemDTO itemDTO) {
        log.info("✏️ API call to update item ID: {}", itemDTO.getId());
        String response = shoppingListService.updateItem(itemDTO);
        return ResponseEntity.ok(response);
    }

    // GET /shopping-list/items
    @GetMapping("/items")
    public ResponseEntity<List<GetShoppingItemsDTO>> getItems() {
        log.info("📦 API call to get all shopping items for user");
        List<GetShoppingItemsDTO> items = shoppingListService.getItems();
        return ResponseEntity.ok(items);
    }

    // DELETE /shopping-list/delete/{id}
    @DeleteMapping("/delete/{itemName}")
    public ResponseEntity<String> deleteItem(@PathVariable String itemName) {
        log.info("🗑️ API call to delete item: {}", itemName);
        shoppingListService.deleteItem(itemName);
        return ResponseEntity.ok("✅ Item deleted successfully");
    }

    // DELETE /shopping-list/delete-all
    @DeleteMapping("/delete-all")
    public ResponseEntity<String> deleteAllItems() {
        log.info("🧹 API call to delete all shopping items for user");
        shoppingListService.deleteAllItems();
        return ResponseEntity.ok("✅ All items deleted for user");
    }

}
