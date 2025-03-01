package com.example.smartshoppingcart.Controller;
import com.example.smartshoppingcart.DTO.CartDTO;
import com.example.smartshoppingcart.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * CartController class is a REST controller that handles HTTP requests related to the shopping cart.
 * It contains endpoints to retrieve all items in the cart, retrieve an item by its unique identifier,
 * add a new item to the cart, update an existing item in the cart, and delete an item from the cart.
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    /**
     * Test endpoint to verify the controller is working.
     * <p>
     * Example:
     * GET /api/cart/test
     */
    @GetMapping("/test")
    public void test(){
        System.out.println("test success");
    }

    /**
     * Retrieves all items in the cart.
     *
     * @return A list of CartDTO objects representing all items in the cart.
     * <p>
     * Example:
     * GET /api/cart/all
     * Response:
     * [
     *   {
     *     "id": 1,
     *     "name": "Item1",
     *     "quantity": 2,
     *     "price": 10.0
     *   },
     *   {
     *     "id": 2,
     *     "name": "Item2",
     *     "quantity": 1,
     *     "price": 20.0
     *   }
     * ]
     */
    @GetMapping("/all")
    public List<CartDTO> getall(){
        return cartService.getAllItems();
    }

    /**
     * Retrieves an item from the cart by its unique identifier.
     *
     * @param id The unique identifier of the item to be retrieved.
     * @return A ResponseEntity containing the CartDTO object representing the retrieved item, or a 404 status if not found.
     * <p>
     * Example:
     * GET /api/cart/id/1
     * Response:
     * {
     *   "id": 1,
     *   "name": "Item1",
     *   "quantity": 2,
     *   "price": 10.0
     * }
     */
    @GetMapping("/id/{id}")
    public ResponseEntity<CartDTO> getById(@PathVariable Long id){
        CartDTO item = cartService.getItemById(id);
        return item != null ? ResponseEntity.ok(item) : ResponseEntity.notFound().build();
    }

    /**
     * Adds a new item to the cart.
     *
     * @param itemDTO The CartDTO object representing the item to be added.
     * @return A ResponseEntity containing the CartDTO object representing the added item.
     * <p>
     * Example:
     * POST /api/cart/addItem
     * Request Body:
     * {
     *   "name": "NewItem",
     *   "quantity": 3,
     *   "price": 15.0
     * }
     * Response:
     * {
     *   "id": 3,
     *   "name": "NewItem",
     *   "quantity": 3,
     *   "price": 15.0
     * }
     */
    @PostMapping("/addItem")
    public ResponseEntity<CartDTO> addItem(@RequestBody CartDTO itemDTO){
        CartDTO newItem = cartService.addItems(itemDTO);
        return ResponseEntity.ok(newItem);
    }

    /**
     * Updates an existing item in the cart.
     *
     * @param id The unique identifier of the item to be updated.
     * @param updateItem The CartDTO object representing the updated item.
     * @return A ResponseEntity containing the CartDTO object representing the updated item, or a 404 status if not found.
     * <p>
     * Example:
     * POST /api/cart/updateItem/1
     * Request Body:
     * {
     *   "name": "UpdatedItem",
     *   "quantity": 5,
     *   "price": 12.0
     * }
     * Response:
     * {
     *   "id": 1,
     *   "name": "UpdatedItem",
     *   "quantity": 5,
     *   "price": 12.0
     * }
     */
    @PostMapping("/updateItem/{id}")
    public ResponseEntity<CartDTO> updateItem(@PathVariable Long id, @RequestBody CartDTO updateItem){
        try{
            CartDTO updated = cartService.updateItem(id, updateItem);
            return ResponseEntity.ok(updated);
        }catch(RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deletes an item from the cart.
     *
     * @param id The unique identifier of the item to be deleted.
     * @return A ResponseEntity containing a success message, or a 404 status if not found.
     * <p>
     * Example:
     * DELETE /api/cart/deleteById/1
     * Response:
     * "Item Removed Successfully"
     */
    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Long id){
        try{
            cartService.deleteItem(id);
            return ResponseEntity.ok("Item Removed Successfully");
        }catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }
}
