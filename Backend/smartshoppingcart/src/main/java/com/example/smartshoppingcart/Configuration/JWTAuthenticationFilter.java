package com.example.smartshoppingcart.Configuration;

import com.example.smartshoppingcart.Repository.TokenRepository;
import com.example.smartshoppingcart.Service.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenRepository tokenRepository;

    /**
     * Filters incoming HTTP requests and validates JWT tokens.
     * <p>
     * This method prioritizes student validation for efficiency, as most users are students.
     *
     * @param request     The incoming HTTP request.
     * @param response    The HTTP response.
     * @param filterChain The filter chain to pass control to the next filter.
     * @throws ServletException If a servlet error occurs.
     * @throws IOException      If an I/O error occurs.
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        System.out.println("Filtering request: " + request.getRequestURI());

        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String username;

        // Validate the Authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the JWT token and username
        jwtToken = authHeader.substring(7);
        username = jwtService.extractUserName(jwtToken);
        System.out.println("Extracted username: " + username);

        // Proceed only if the username is not already authenticated in the SecurityContext
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = null;
            boolean isTokenValid = false;

            // check in User repository
            try {
                userDetails = userDetailsService.loadUserByUsername(username);
                isTokenValid = tokenRepository.findByToken(jwtToken)
                        .map(t -> !t.isExpired() && !t.isRevoked())
                        .orElse(false);
                System.out.println("User found in User repository.");
            } catch (Exception e) {
                System.out.println("User not found in User repository.");
            }

            // Validate the token and set the SecurityContext if valid
            if (userDetails != null && jwtService.validateToken(jwtToken, userDetails) && isTokenValid) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("Authenticated user: " + username);
            }
        }

        // 🔹 Ensure the Security Context is NOT cleared between requests
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            System.out.println("⚠️ Warning: Security Context is empty after filtering.");
        }

        // Pass the request to the next filter in the chain
        filterChain.doFilter(request, response);
    }
}
