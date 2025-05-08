package com.example.smartshoppingcart.Repository;

import com.example.smartshoppingcart.Model.ResetCode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing ResetCode entities in the database.
 * <p>
 * Extends JpaRepository to provide basic CRUD operations, along with custom query methods
 * for handling password reset codes.
 * <p>
 * Entity: ResetCode
 * Primary Key Type: Long
 */
public interface ResetCodeRepository extends JpaRepository<ResetCode, Long> {

    /**
     * Finds a ResetCode entity by email and reset code.
     *
     * @param email The email address associated with the reset code.
     * @param code  The reset code.
     * @return An Optional containing the matching ResetCode entity, if found.
     */
    Optional<ResetCode> findByEmailAndResetCode(String email, String code);

    /**
     * Finds all ResetCode entities associated with a specific email address.
     *
     * @param email The email address to search for.
     * @return A list of ResetCode entities associated with the given email.
     */
    List<ResetCode> findByEmail(String email);

    /**
     * Deletes all ResetCode entities associated with a specific email address.
     *
     * @param email The email address to delete reset codes for.
     */
    void deleteByEmail(String email);

    /**
     * Deletes all ResetCode entities where the expired flag matches the given value.
     *
     * @param expired The value of the expired flag (true for expired, false for non-expired).
     */
    void deleteByExpired(boolean expired);
}

