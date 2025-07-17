package com.sb.userservice.repository;

import com.sb.userservice.model.Role;
import com.sb.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByRole(Role role);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByNic(String nic);

    int countByRole(Role role);

    void deleteByUsername(String username);

    Optional<User> findByUsername(String username);

    Optional<User> findByNic(String nic);
}
