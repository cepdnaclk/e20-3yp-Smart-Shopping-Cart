package com.example.smartshoppingcart.Model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a token in the application.
 * This entity is used for authentication and authorization purposes.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "token")
public class Token {

    /**
     * Unique identifier for the token.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    /**
     * The token string, which must be unique and not null.
     */
    @Column(unique = true, nullable = false)
    public String token;

    /**
     * The type of the token, default is BEARER.
     */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    public TokenType tokenType = TokenType.BEARER;

    /**
     * Indicates whether the token has been revoked.
     */
    public boolean revoked;

    /**
     * Indicates whether the token has expired.
     */
    public boolean expired;

    /**
     * The user associated with the token.
     * This is a many-to-one relationship with the Users entity.
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private Users users;

}