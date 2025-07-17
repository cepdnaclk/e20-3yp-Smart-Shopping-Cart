package com.sb.userservice.service;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;
import java.util.function.Function;

public interface JWTService {

    /**
     * Extracts the username (subject) from the given JWT token.
     *
     * @param token The JWT token.
     * @return The username embedded in the token.
     */
    String extractUserName(String token);

    /**
     * Extracts a specific claim from the given JWT token using the provided resolver function.
     *
     * @param token The JWT token.
     * @param claimsResolver A function to resolve the desired claim from the token.
     * @param <T> The type of the resolved claim.
     * @return The resolved claim.
     */
    <T> T extractClaims(String token, Function<Claims, T> claimsResolver);

    /**
     * Generates a new JWT token with default claims for the given user details.
     *
     * @param userDetails The user details object containing user information.
     * @return A new JWT token.
     */
    String generateToken(UserDetails userDetails);

    /**
     * Generates a new JWT token with additional claims for the given user details.
     *
     * @param extraClaims A map of additional claims to include in the token.
     * @param userDetails The user details object containing user information.
     * @return A new JWT token with the specified claims.
     */
    String generateToken(Map<String, Object> extraClaims, UserDetails userDetails);

    /**
     * Generates a refresh token for the given user details.
     * Refresh tokens typically have a longer expiration period than access tokens.
     *
     * @param userDetails The user details object containing user information.
     * @return A new refresh token.
     */
    String generateRefreshToken(UserDetails userDetails);

    /**
     * Validates the given JWT token by checking its expiration and comparing the username
     * in the token with the provided user details.
     *
     * @param token The JWT token to validate.
     * @param userDetails The user details to validate against.
     * @return True if the token is valid, false otherwise.
     */
    boolean validateToken(String token, UserDetails userDetails);

}
