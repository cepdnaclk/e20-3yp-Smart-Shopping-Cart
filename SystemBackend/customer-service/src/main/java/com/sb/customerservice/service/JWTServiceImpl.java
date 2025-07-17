package com.sb.customerservice.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTServiceImpl implements JWTService {

    // Secret key for signing JWTs, injected from application properties
    @Value("${spring.application.security.jwt.secret-key}")
    private String secretKey;

    // Expiration time for access tokens in milliseconds
    @Value("${spring.application.security.jwt.expiration}")
    private long jwtExpiration;

    // Expiration time for refresh tokens in milliseconds
    @Value("${spring.application.security.jwt.refresh-token.expiration}")
    private long jwtRefreshExpiration;

    /**
     * Extracts the username (subject) from the JWT token.
     *
     * @param token The JWT token.
     * @return The username (subject) embedded in the token.
     */
    @Override
    public String extractUserName(String token) {
        return extractClaims(token, Claims::getSubject);
    }

    /**
     * Extracts specific claims from the JWT token using a custom resolver.
     *
     * @param token The JWT token.
     * @param claimsResolver A function to resolve the desired claim from the token.
     * @param <T> The type of the resolved claim.
     * @return The resolved claim.
     */
    @Override
    public <T> T extractClaims(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Generates a new JWT token with default claims.
     *
     * @param userDetails The user details object containing user information.
     * @return A new JWT token.
     */
    @Override
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generates a new JWT token with custom claims.
     *
     * @param extraClaims Additional claims to include in the token.
     * @param userDetails The user details object containing user information.
     * @return A new JWT token.
     */
    @Override
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    /**
     * Generates a refresh token for the given user.
     *
     * @param userDetails The user details object containing user information.
     * @return A new refresh token.
     */
    @Override
    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, jwtRefreshExpiration);
    }

    /**
     * Builds a JWT token with the specified claims, user details, and expiration time.
     *
     * @param extraClaims Additional claims to include in the token.
     * @param userDetails The user details object containing user information.
     * @param expiration The expiration time in milliseconds.
     * @return A new JWT token.
     */
    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ){
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey())
                .compact();
    }

    /**
     * Validates the JWT token by comparing its username with the provided user details
     * and ensuring the token has not expired.
     *
     * @param token The JWT token.
     * @param userDetails The user details to validate against.
     * @return True if the token is valid, false otherwise.
     */
    @Override
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUserName(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            // Return false if the token is expired
            return false;
        }
    }

    /**
     * Checks if the JWT token has expired.
     *
     * @param token The JWT token.
     * @return True if the token has expired, false otherwise.
     */
    private boolean isTokenExpired(String token) {return extractExpiration(token).before(new Date());}

    /**
     * Extracts the expiration date from the JWT token.
     *
     * @param token The JWT token.
     * @return The expiration date of the token.
     */
    private Date extractExpiration(String token) {
        return extractClaims(token, Claims::getExpiration);
    }

    /**
     * Extracts all claims from the JWT token.
     *
     * @param token The JWT token.
     * @return All claims embedded in the token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey()) // Use verifyWith instead of setSigningKey
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extracts the role from the JWT token.
     *
     * @param token The JWT token.
     * @return The role embedded in the token.
     */
    public String extractRole(String token) {
        return extractClaims(token, claims -> claims.get("role", String.class));
    }

    /**
     * Decodes the secret key from Base64 and generates a signing key.
     *
     * @return The signing key.
     */
    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
