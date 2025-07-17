package com.sb.productservice.repository;

import com.sb.productservice.model.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Products, UUID> {

    Optional<Products> findByProductName(String productName);

    Optional<Products> findByBarcode(String barcode);


}
