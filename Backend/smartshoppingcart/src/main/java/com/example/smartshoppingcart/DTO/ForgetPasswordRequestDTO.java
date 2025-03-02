package com.example.smartshoppingcart.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Data Transfer Object (DTO) for handling forget password requests.
 * <p>
 * Contains fields for username and email, with validation annotations to ensure proper input.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO for initiating the password recovery process")
public class ForgetPasswordRequestDTO {

    /**
     * The username of the user requesting password recovery.
     * <p>
     * Example: "john_doe"
     */
    @NotBlank(message = "Username is required")
    @Schema(description = "The username of the user", example = "john_doe")
    private String username;

    /**
     * The email of the user requesting password recovery.
     * <p>
     * Example: "john_doe@example.com"
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Schema(description = "The email address of the user", example = "john_doe@example.com")
    private String email;
}
