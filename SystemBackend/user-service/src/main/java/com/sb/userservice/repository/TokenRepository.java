package com.sb.userservice.repository;

import com.sb.userservice.model.Token;
import com.sb.userservice.model.User;
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


    @Query("""
        select t from Token t
        where t.user.id = :userId
        and (t.expired = false or t.revoked = false)
        """)
    List<Token> findAllValidTokenByUser(@Param("userId") UUID userId);


    @Transactional
    @Modifying
    @Query("delete from Token t where t.user.id = :userId")
    void deleteByUserId(@Param("userId") UUID userId);


    void deleteByUser(User user);

}
