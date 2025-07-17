package com.sb.userservice.service;

import com.sb.userservice.repository.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LogoutServiceImpl implements LogoutService, LogoutHandler {

    private final TokenRepository tokenRepository;

    public LogoutServiceImpl(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Override
    @Transactional
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
