package com.example.smartshoppingcart.Service;

import com.example.smartshoppingcart.Repository.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

/**
 * Service implementation for handling user logout operations.
 * <p>
 * This class implements both the `LogoutService` interface and the `LogoutHandler`
 * interface provided by Spring Security. It manages token revocation and expiration
 * during the logout process.
 */
@Service
@RequiredArgsConstructor
public class LogoutServiceImpl implements LogoutService, LogoutHandler {

    // Repository for managing stored tokens
    private final TokenRepository tokenRepository;

    /**
     * Handles the logout process, including token revocation and expiration.
     * <p>
     * This method is invoked during the logout process to invalidate the JWT token
     * provided in the `Authorization` header.
     *
     * @param request        The HTTP servlet request.
     * @param response       The HTTP servlet response.
     * @param authentication The current authentication object (can be null).
     */
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;

        // Validate the Authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return; // Exit if the header is missing or does not contain a Bearer token
        }

        // Extract the JWT token from the Authorization header
        jwtToken = authHeader.substring(7);

        // Retrieve the stored token from the database
        var storedToken = tokenRepository.findByToken(jwtToken).orElse(null);

        // Mark the token as expired and revoked if it exists in the repository
        if (storedToken != null) {
            storedToken.setExpired(true);
            storedToken.setRevoked(true);
            tokenRepository.save(storedToken); // Persist the changes
        }
    }
}
