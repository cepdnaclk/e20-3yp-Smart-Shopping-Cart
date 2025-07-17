package com.sb.customerservice.service;

import com.sb.customerservice.repository.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LogoutServiceImpl implements  LogoutService, LogoutHandler {

    private final TokenRepository tokenRepository;

    public LogoutServiceImpl(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    private static final Logger logger = LoggerFactory.getLogger(LogoutServiceImpl.class);

    @Override
    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;

        System.out.println("Logout endpoint hit. Authorization: " + authHeader);

        // Validate the Authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No valid Authorization header for logout.");
            return;
        }

        // Extract the JWT token from the Authorization header
        jwtToken = authHeader.substring(7);

        // Retrieve the stored token from the database
        var storedToken = tokenRepository.findByToken(jwtToken).orElse(null);

        // Mark the token as expired and revoked if it exists in the repository
        if (storedToken != null) {
            storedToken.setExpired(true);
            storedToken.setRevoked(true);
            tokenRepository.save(storedToken);
            System.out.println("Token revoked successfully.");
        } else {
            System.out.println("Token not found in DB.");
        }
    }

}
