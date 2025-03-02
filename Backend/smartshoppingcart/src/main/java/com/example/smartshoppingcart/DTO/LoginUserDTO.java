package com.example.smartshoppingcart.DTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data transfer object representing a user login request.
 * <p>
 * Contains fields required for authenticating a user.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginUserDTO {

    /**
     * The username of the user attempting to log in.
     * <p>
     * Example: "john_doe"
     */
    private String username;

    /**
     * The password of the user attempting to log in.
     * <p>
     * Example: "securePassword123"
     */
    private String password;

}
