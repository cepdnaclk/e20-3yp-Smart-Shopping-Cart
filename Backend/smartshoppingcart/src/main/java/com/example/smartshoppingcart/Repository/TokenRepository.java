package com.example.smartshoppingcart.Repository;
import com.example.smartshoppingcart.Model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing Token entities in the database.
 *
 * Provides CRUD operations and custom queries for Token entities,
 * including finding valid tokens and deleting tokens for users and students.
 */
public interface TokenRepository extends JpaRepository<Token, Long> {

    /**
     * Finds a token entity by its token string.
     *
     * @param token The token string to search for.
     * @return An Optional containing the Token entity if found, or an empty Optional if not found.
     */
    Optional<Token> findByToken(String token);

    /**
     * Finds all valid tokens associated with a user by their ID.
     *
     * A token is valid if it is not expired and not revoked.
     *
     * @param userId The ID of the user.
     * @return A list of valid Token entities associated with the given user ID.
     */
    @Query("""
      select t from Token t 
      where t.users.id = :userId
      and (t.expired = false or t.revoked = false)
      """)
    List<Token> findAllValidTokenByUser(@Param("userId") Integer userId);


    /**
     * Deletes all tokens associated with a specific user by their ID.
     *
     * @param userId The ID of the user whose tokens are to be deleted.
     */
    @Transactional
    @Modifying
    @Query("DELETE FROM Token t WHERE t.users.id = :userId")
    void deleteByUserId(@Param("userId") Integer userId);


}
