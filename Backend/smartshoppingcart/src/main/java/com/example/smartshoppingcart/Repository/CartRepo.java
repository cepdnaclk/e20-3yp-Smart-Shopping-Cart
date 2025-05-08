package com.example.smartshoppingcart.Repository;
import com.example.smartshoppingcart.Model.CartModel;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for CartModel entities.
 * <p>
 * This interface extends JpaRepository to provide CRUD operations
 * for CartModel entities.
 */
public interface CartRepo extends JpaRepository<CartModel,Long> {
}
