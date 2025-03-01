package com.example.smartshoppingcart.Configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.concurrent.TimeUnit;

/**
 * Custom filter to handle user inactivity by invalidating the session and clearing
 * the security context after a specified period of inactivity.
 * <p>
 * This filter is executed once per request and checks the time of the last user request.
 * If the user has been inactive for more than the defined interval, their session is invalidated.
 */
@Component
public class InactivityFilter extends OncePerRequestFilter {

    // Maximum allowable inactive interval (10 minutes)
    private static final long MAX_INACTIVE_INTERVAL_MS = TimeUnit.MINUTES.toMillis(10);

    // Attribute name for storing the last request time in the session
    private static final String LAST_REQUEST_TIME_ATTR = "lastRequestTime";

    /**
     * The main filter logic that checks for user inactivity and invalidates the session if necessary.
     *
     * @param request  The current HTTP request.
     * @param response The current HTTP response.
     * @param filterChain The filter chain to pass the request and response to the next filter.
     * @throws ServletException If an error occurs during filtering.
     * @throws IOException If an I/O error occurs during filtering.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // Retrieve the last request time from the session
        Long lastRequestTime = (Long) request.getSession().getAttribute(LAST_REQUEST_TIME_ATTR);

        // Get the current time in milliseconds
        long currentTime = Instant.now().toEpochMilli();

        // 🔹 Ensure the user is authenticated before applying inactivity rules
        if (SecurityContextHolder.getContext().getAuthentication() != null) {

            // 🔹 Only check inactivity if lastRequestTime is set (prevents issues on first login)
            if (lastRequestTime != null && (currentTime - lastRequestTime) > MAX_INACTIVE_INTERVAL_MS) {
                // Invalidate session and clear security context **only if user is truly inactive**
                request.getSession().invalidate();
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                System.out.println("❌ User session invalidated due to inactivity.");
                return;
            }
            // 🔹 Only update last request time if the user is authenticated and active
            request.getSession().setAttribute(LAST_REQUEST_TIME_ATTR, currentTime);
        } else {
            System.out.println("🔍 No active authentication found. Skipping inactivity check.");
        }
        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }

}
