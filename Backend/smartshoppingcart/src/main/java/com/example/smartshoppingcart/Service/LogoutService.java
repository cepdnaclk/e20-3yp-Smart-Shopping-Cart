package com.example.smartshoppingcart.Service;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

/**
 * Interface for managing user logout operations.
 * <p>
 * This interface defines the contract for handling the logout process,
 * including token invalidation, session cleanup, and other logout-related tasks.
 */
public interface LogoutService {

    /**
     * Handles the logout process for a user.
     * <p>
     * This method is responsible for performing any necessary cleanup operations during logout,
     * such as invalidating tokens or clearing security contexts.
     *
     * @param request        The HTTP servlet request, which contains the user's request information.
     * @param response       The HTTP servlet response, used to send the logout response to the client.
     * @param authentication The current authentication object, representing the user's authentication state.
     */
    void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication);
}
