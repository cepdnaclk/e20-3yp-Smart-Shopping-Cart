package com.example.smartshoppingcart;

import com.example.smartshoppingcart.Service.JWTServiceImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import javax.crypto.SecretKey;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class JWTServiceTest {

    private JWTServiceImpl jwtService;
    private static final String SECRET_KEY = "d81a69fcb8296b507fac769984f09b362664caa44e7c67e1bccd336e2eadd18f"; // Simulate a Base64-encoded key
    private static final long EXPIRATION = 1000 * 60 * 60; // 1 hour
    private static final long REFRESH_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7 days

    @BeforeEach
    void setUp() throws IllegalAccessException, NoSuchFieldException {
        jwtService = new JWTServiceImpl();
        // Use reflection to set the private fields
        Field secretKeyField = JWTServiceImpl.class.getDeclaredField("secretKey");
        secretKeyField.setAccessible(true);
        secretKeyField.set(jwtService, SECRET_KEY);

        Field jwtExpirationField = JWTServiceImpl.class.getDeclaredField("jwtExpiration");
        jwtExpirationField.setAccessible(true);
        jwtExpirationField.set(jwtService, EXPIRATION);

        Field jwtRefreshExpirationField = JWTServiceImpl.class.getDeclaredField("jwtRefreshExpiration");
        jwtRefreshExpirationField.setAccessible(true);
        jwtRefreshExpirationField.set(jwtService, REFRESH_EXPIRATION);
    }

    @Test
    void testGenerateToken() {
        // Given
        UserDetails userDetails = new User("testUser", "password", new ArrayList<>());

        // When
        String token = jwtService.generateToken(userDetails);

        // Then
        assertNotNull(token);
        assertEquals("testUser", jwtService.extractUserName(token));
    }

    @Test
    void testGenerateTokenWithExtraClaims() {
        // Given
        UserDetails userDetails = new User("testUser", "password", new ArrayList<>());
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", "ADMIN");

        // When
        String token = jwtService.generateToken(extraClaims, userDetails);

        // Then
        assertNotNull(token);
        assertEquals("testUser", jwtService.extractUserName(token));
        assertEquals("ADMIN", jwtService.extractClaims(token, claims -> claims.get("role")));
    }

    @Test
    void testGenerateRefreshToken() {
        // Given
        UserDetails userDetails = new User("testUser", "password", new ArrayList<>());

        // When
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        // Then
        assertNotNull(refreshToken);
        assertEquals("testUser", jwtService.extractUserName(refreshToken));
    }

    @Test
    void testValidateToken_ValidToken() {
        // Given
        UserDetails userDetails = new User("testUser", "password", new ArrayList<>());
        String token = jwtService.generateToken(userDetails);

        // When
        boolean isValid = jwtService.validateToken(token, userDetails);

        // Then
        assertTrue(isValid);
    }

    @Test
    void testValidateToken_ExpiredToken() throws NoSuchFieldException, IllegalAccessException {
        // Given
        UserDetails userDetails = new User("testUser", "password", new ArrayList<>());

        // Use reflection to set the private 'jwtExpiration' field to a past time
        Field jwtExpirationField = JWTServiceImpl.class.getDeclaredField("jwtExpiration");
        jwtExpirationField.setAccessible(true);
        jwtExpirationField.set(jwtService, -1L); // Set expiration to the past

        String expiredToken = jwtService.generateToken(userDetails);

        // When
        boolean isValid = jwtService.validateToken(expiredToken, userDetails);

        // Then
        assertFalse(isValid);
    }

    @Test
    void testExtractUserName() {
        // Given
        UserDetails userDetails = new User("testUser", "password", new ArrayList<>());
        String token = jwtService.generateToken(userDetails);

        // When
        String username = jwtService.extractUserName(token);

        // Then
        assertEquals("testUser", username);
    }

    @Test
    void testExtractClaims() {
        // Given
        UserDetails userDetails = new User("testUser", "password", new ArrayList<>());
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("customClaim", "customValue");
        String token = jwtService.generateToken(extraClaims, userDetails);

        // When
        String customClaimValue = jwtService.extractClaims(token, claims -> claims.get("customClaim")).toString();

        // Then
        assertEquals("customValue", customClaimValue);
    }
}
