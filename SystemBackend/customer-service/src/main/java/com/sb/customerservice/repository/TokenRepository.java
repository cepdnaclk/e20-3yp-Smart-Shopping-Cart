package com.sb.customerservice.repository;

import com.sb.customerservice.model.Customer;
import com.sb.customerservice.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TokenRepository extends JpaRepository<Token, Long> {

    Optional<Token> findByToken(String token);

    /**
     * Find all valid (not expired or revoked) tokens for a specific customer ID
     */
    @Query("""
        select t from Token t
        where t.customer.id = :customerId
        and (t.expired = false or t.revoked = false)
        """)
    List<Token> findAllValidTokenByCustomer(@Param("customerId") UUID customerId);

    /**
     * Delete all tokens by customer ID
     */
    @Transactional
    @Modifying
    @Query("delete from Token t where t.customer.id = :customerId")
    void deleteByCustomerId(@Param("customerId") UUID customerId);

    /**
     * Delete all tokens by customer entity
     */
    void deleteByCustomer(Customer customer);


}
