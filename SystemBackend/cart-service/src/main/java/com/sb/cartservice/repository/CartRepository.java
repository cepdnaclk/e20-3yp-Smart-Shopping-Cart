package com.sb.cartservice.repository;

import com.sb.cartservice.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart,Long> {

    List<Cart> findByUserId(String userId);

}
