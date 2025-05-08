package com.example.smartshoppingcart.Repository;
import com.example.smartshoppingcart.Model.Role;
import com.example.smartshoppingcart.Model.Users;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repository interface for managing Users entity in the database.
 * <p>
 * Extends JpaRepository to provide basic CRUD operations, query execution,
 * and additional features like pagination and sorting for the Users entity.
 * <p>
 * Entity: Users
 * Primary Key Type: Integer
 */
public interface UserRepository extends JpaRepository<Users, Integer> {

    /**
     * Finds a user by their username.
     *
     * @param username the username of the user to find
     * @return an Optional containing the found user, or an empty Optional if no user was found
     */
    Optional<Users> findByUsername(String username);

    /**
     * Finds a user by their NIC.
     *
     * @param nic the NIC of the user to find
     * @return an Optional containing the found user, or an empty Optional if no user was found
     */
    Optional<Users> findByNic(@NotNull @Size(min = 10, max = 12) String nic);

    /**
     * Finds a user by their email.
     *
     * @param email the email of the user to find
     * @return an Optional containing the found user, or an empty Optional if no user was found
     */
    Optional<Users> findByEmail(String email);

    /**
     * Counts the number of users with the specified role.
     *
     * @param role the role to count
     * @return the number of users with the specified role
     */
    int countByRole(Role role);
}
