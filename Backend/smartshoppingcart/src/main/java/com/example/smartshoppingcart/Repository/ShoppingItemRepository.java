package com.example.smartshoppingcart.Repository;
import com.example.smartshoppingcart.Model.ShoppingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


/**
 * Repository interface for ShoppingItem entities.
 * <p>
 * This interface extends JpaRepository to provide CRUD operations
 * for ShoppingItem entities.
 */
@Repository
public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Integer> {

    /**
     * Finds a list of ShoppingItem entities by the user ID.
     *
     * @param userId the ID of the user
     * @return a list of ShoppingItem entities associated with the given user ID
     */
    List<ShoppingItem> findByUserId(Integer userId);
}
