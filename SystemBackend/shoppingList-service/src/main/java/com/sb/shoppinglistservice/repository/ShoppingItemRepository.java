package com.sb.shoppinglistservice.repository;

import com.sb.shoppinglistservice.model.ShoppingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Long> {

    Optional<ShoppingItem> findByItemName(String itemName);

    void deleteByItemName(String itemName);

    void deleteAllByUsername(String username);
}
