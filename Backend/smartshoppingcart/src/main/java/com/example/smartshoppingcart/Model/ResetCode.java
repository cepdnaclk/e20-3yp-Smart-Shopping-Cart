package com.example.smartshoppingcart.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity class representing a password reset code.
 * <p>
 * This entity is used to store reset codes for password recovery.
 * Each reset code is associated with an email address, an expiration
 * time, and a status indicating whether the code has expired.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reset_code") // Maps this class to the "reset_code" table in the database
public class ResetCode {

    /**
     * Primary key of the reset code entity.
     * Auto-generated using the IDENTITY strategy.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The email address associated with the reset code.
     * Used to identify the user requesting the password reset.
     */
    private String email;

    /**
     * The reset code sent to the user for password recovery.
     */
    private String resetCode;

    /**
     * The expiration time of the reset code.
     * The code is considered invalid after this time.
     */
    private LocalDateTime expirationTime;

    /**
     * Indicates whether the reset code has been marked as expired.
     * Defaults to false.
     */
    private boolean expired = false;
}

