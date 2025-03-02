package com.example.smartshoppingcart.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for encapsulating authentication responses.
 * <p>
 * This DTO is used to return authentication-related data, such as access tokens,
 * refresh tokens, user roles, and status messages, to the client after a successful
 * login or registration.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

    /**
     * The JWT access token for user authentication.
     * <p>
     * This token is used for accessing secured endpoints and contains
     * information about the user, such as username and expiration time.
     * <p>
     * Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     */
    @JsonProperty("access_token")
    private String accessToken;

    /**
     * The JWT refresh token for obtaining new access tokens.
     * <p>
     * This token is used to generate a new access token without requiring
     * the user to log in again, ensuring a smooth user experience.
     * <p>
     * Example: "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
     */
    @JsonProperty("refresh_token")
    private String refreshToken;

    /**
     * The role of the authenticated user.
     * <p>
     * This field indicates the user's role (e.g., ADMIN, TEACHER, STUDENT),
     * which determines their permissions and access level within the system.
     * <p>
     * Example: "ADMIN"
     */
    private String role;

    /**
     * A message indicating the status of the authentication process.
     * <p>
     * This field provides additional context, such as success or error messages,
     * to inform the client about the result of the authentication operation.
     * <p>
     * Example: "Authentication successful"
     */
    private String message;
}
