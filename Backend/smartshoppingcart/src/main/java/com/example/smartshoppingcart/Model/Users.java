package com.example.smartshoppingcart.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Entity representing a user in the application.
 * Implements UserDetails for Spring Security integration.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class   Users implements UserDetails {

    /**
     * Unique identifier for the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Username of the user.
     * Must be between 3 and 50 characters.
     */
    @NotNull
    @Size(min = 3, max = 50)
    private String username;

    /**
     * First name of the user.
     * Must be between 1 and 50 characters.
     */
    @NotNull
    @Size(min = 1, max = 50)
    private String firstName;

    /**
     * Last name of the user.
     * Must be between 1 and 50 characters.
     */
    @NotNull
    @Size(min = 1, max = 50)
    private String lastName;

    /**
     * National Identity Card number of the user.
     * Must be between 10 and 12 characters.
     */
    @NotNull
    @Size(min = 10, max = 12)
    private String nic;

    /**
     * Email address of the user.
     * Must be a valid email format.
     */
    @NotNull
    @Email
    private String email;

    /**
     * Phone number of the user.
     * Must be between 10 and 15 characters.
     */
    @NotNull
    @Size(min = 10, max = 15)
    private String phone;

    /**
     * Password of the user.
     * Must be between 8 and 100 characters.
     */
    @NotNull
    @Size(min = 8, max = 100)
    private String password;

    /**
     * Link to the profile image of the user.
     */
    private String profileImageLink;

    /**
     * Role of the user in the application.
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    private Role role;

    /**
     * List of tokens associated with the user.
     * One-to-many relationship with the Token entity.
     */
    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL)
    private List<Token> tokens;

    /**
     * Returns the authorities granted to the user.
     * Currently returns an empty list.
     *
     * @return Collection of granted authorities.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }
}