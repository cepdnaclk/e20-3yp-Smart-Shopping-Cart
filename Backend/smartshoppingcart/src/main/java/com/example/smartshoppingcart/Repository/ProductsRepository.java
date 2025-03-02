package com.example.smartshoppingcart.Repository;
import com.example.smartshoppingcart.Model.Products;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for the Products entity.
 */
public interface ProductsRepository extends JpaRepository<Products, Long> {

    /**
     * Find a product by its barcode.
     *
     * @param barcode The barcode of the product.
     * @return The product with the given barcode, or null if no product was found.
     */
    Optional<Products> findByBarcode(String barcode);

    /**
     * Find a product by its name.
     *
     * @param name The name of the product.
     * @return The product with the given name, or null if no product was found.
     */
    List<Products> findByNameContainingIgnoreCaseAndCategory(String name, String category);

}
