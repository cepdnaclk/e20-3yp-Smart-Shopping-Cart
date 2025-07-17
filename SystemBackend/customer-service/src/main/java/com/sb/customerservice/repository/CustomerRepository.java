package com.sb.customerservice.repository;

import com.sb.customerservice.model.Customer;
import org.checkerframework.checker.units.qual.C;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByNic(String nic);

    void deleteByUsername(String username);

    Optional<Customer> findByUsername(String username);

    Optional<Customer> findByNic(String nic);

}
